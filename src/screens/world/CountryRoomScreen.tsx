import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
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
import { ExploreStackParamList, PlacedFurniture } from '../../types';
import type { CountryFact } from '../../types';
import { FURNITURE_CATALOG, getAvailableFurniture, WALLPAPER_OPTIONS, FLOORING_OPTIONS } from '../../config/furniture';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { getCountryQuiz, QuizQuestion, getCountryLocations, CountryLocation } from '../../config/learningContent';
import { COUNTRY_HOUSES, RoomObject, HouseRoom } from '../../config/countryRooms';
import { getCountryAtmosphere } from '../../config/countryAtmosphere';
import { FurnitureVisual } from '../../components/furniture/FurnitureVisual';
import type { FurnitureInteractionType } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AVATAR_SIZE = 84;
const ROOM_HEIGHT = 340;
const WALL_HEIGHT = 232;
const FLOOR_HEIGHT = 108;
const WINDOW_STRIP_HEIGHT = 48;
const FACT_AURA_REWARD = 5;
const QUIZ_AURA_PER_CORRECT = 25;

type CountryRoomScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'CountryRoom'>;
  route: { params: { countryId: string; friendUserId?: string } };
};

export const CountryRoomScreen: React.FC<CountryRoomScreenProps> = ({ navigation, route }) => {
  const { countryId, friendUserId } = route.params;
  const country = COUNTRIES.find((c) => c.id === countryId);
  const houseData = COUNTRY_HOUSES[countryId];
  const { visby, user, friends, addAura, getStreakMultiplier, userHouses, ownedFurniture, buyFurniture, placeFurniture, removePlacedFurniture, updateRoomColors, feedVisby, restVisby, playWithVisby, studyWithVisby, markFactRead, markQuizCompleted, getCountryProgress, chargeSocialBattery } = useStore();

  const friend = friendUserId ? friends.find((f) => f.userId === friendUserId) : null;
  const isViewingFriendHouse = !!friendUserId && !!friend;
  const isOwner = !isViewingFriendHouse && userHouses.some((h) => h.countryId === countryId);
  const roomTitle = isViewingFriendHouse ? `${friend?.displayName}'s Home` : (country?.name ?? 'Room');
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

  // Games modal
  const [showGamesModal, setShowGamesModal] = useState(false);

  // Locations ("Stops to Visit")
  const [showLocationsModal, setShowLocationsModal] = useState(false);
  const [visitedLocations, setVisitedLocations] = useState<Set<string>>(new Set());
  const locations = getCountryLocations(countryId);

  // Edit / Decorate mode
  const [editMode, setEditMode] = useState(false);
  const [showFurniturePanel, setShowFurniturePanel] = useState(false);
  const [showWallpaperPanel, setShowWallpaperPanel] = useState(false);
  const [showFlooringPanel, setShowFlooringPanel] = useState(false);
  const [selectedPlacedItem, setSelectedPlacedItem] = useState<string | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<'furniture' | 'wallpaper' | 'flooring' | null>(null);
  /** When user taps a placed furniture with interactionType (eat, cook, rest, etc.) */
  const [activeFurnitureInteraction, setActiveFurnitureInteraction] = useState<{
    placed: PlacedFurniture;
    catalogItem: import('../../types').FurnitureItem;
  } | null>(null);
  /** Show "Not enough Aura" under a furniture item when buy fails */
  const [notEnoughAuraFor, setNotEnoughAuraFor] = useState<string | null>(null);

  const house = isViewingFriendHouse ? undefined : userHouses.find(h => h.countryId === countryId);
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

  // Visiting a friend's house fills Visby's social battery
  useEffect(() => {
    if (isViewingFriendHouse) chargeSocialBattery(10);
  }, [isViewingFriendHouse, chargeSocialBattery]);

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
      markFactRead(countryId);
    }
  }, [readFacts, addAura, countryId, markFactRead]);

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
      markFactRead(countryId);
    }
  }, [country?.facts, factIndex, readFacts, addAura, countryId, markFactRead]);

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
        markQuizCompleted(countryId);
        setQuizFinished(true);
      } else {
        setQuizIndex((i) => i + 1);
        setQuizSelected(null);
      }
    }, 800);
  }, [quizSelected, quizIndex, quizQuestions, quizScore, addAura, markQuizCompleted, countryId]);

  const handleVisitLocation = useCallback((location: CountryLocation) => {
    if (visitedLocations.has(location.id)) return;
    setVisitedLocations(prev => new Set(prev).add(location.id));
    addAura(location.learningPoints);
    const skillMap: Record<string, keyof import('../../types').SkillProgress> = {
      landmark: 'geography',
      food: 'cooking',
      nature: 'exploration',
      culture: 'culture',
      hidden_gem: 'exploration',
    };
    const skill = skillMap[location.category];
    if (skill) addSkillPoints(skill, 2);
  }, [visitedLocations, addAura, addSkillPoints]);

  const LOCATION_CATEGORY_ICONS: Record<CountryLocation['category'], IconName> = {
    landmark: 'city',
    food: 'food',
    nature: 'nature',
    culture: 'culture',
    hidden_gem: 'compass',
  };

  const handleUseFurniture = useCallback((interactionType: FurnitureInteractionType, aura: number) => {
    if (interactionType === 'table' || interactionType === 'stove') feedVisby();
    else if (interactionType === 'bed') restVisby();
    else if (interactionType === 'toy') playWithVisby();
    else if (interactionType === 'bookshelf') studyWithVisby();
    addAura(Math.round(aura * multiplier));
    setActiveFurnitureInteraction(null);
  }, [feedVisby, restVisby, playWithVisby, studyWithVisby, addAura, multiplier]);

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
  const atmosphere = getCountryAtmosphere(countryId);
  const countryProgress = getCountryProgress(countryId);
  const isPlaceComplete = countryProgress.factsReadCount >= facts.length && countryProgress.quizCompleted;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[...atmosphere.immersiveBg]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.5, 1]}
      />
      <FloatingParticles
        count={countryId === 'jp' || countryId === 'fr' ? 14 : 10}
        variant={atmosphere.particleVariant}
        customColors={atmosphere.particleColors}
        opacity={countryId === 'jp' ? 0.35 : 0.22}
        speed="slow"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.flagTitle}>{country.flagEmoji} {roomTitle}</Text>
              {isOwner && <Caption style={styles.ownerTag}>Your House</Caption>}
              {isViewingFriendHouse && friend && (
                <Caption style={styles.ownerTag}>Visiting {friend.displayName}'s home</Caption>
              )}
              <Text style={styles.vibeCaption}>
                {isViewingFriendHouse ? `Visiting in ${country.name}` : `Walking through ${country.name} with your Visby`}
              </Text>
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

          {/* Place complete — you've mastered this country, next level */}
          {isPlaceComplete && (
            <View style={styles.placeCompleteBanner}>
              <LinearGradient
                colors={[colors.success.honeydew, colors.reward.peachLight, colors.primary.wisteriaFaded]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.placeCompleteContent}>
                <Icon name="trophy" size={32} color={colors.reward.gold} />
                <View style={styles.placeCompleteText}>
                  <Text style={styles.placeCompleteTitle}>Place complete!</Text>
                  <Text style={styles.placeCompleteSub}>You've mastered {country.name}. Explore the next place.</Text>
                </View>
              </View>
            </View>
          )}

          {/* Room cards (choose room) */}
          {rooms.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomCardsRow}>
              {rooms.map((room, idx) => {
                const isActive = idx === currentRoomIdx;
                const rCustom = house?.roomCustomizations?.[room.id];
                const roomWall = rCustom?.wallColor || room.wallColor;
                return (
                  <TouchableOpacity
                    key={room.id}
                    style={[styles.roomCard, isActive && styles.roomCardActive]}
                    onPress={() => goToRoom(idx)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.roomCardSwatch, { backgroundColor: roomWall }]} />
                    <View style={styles.roomCardContent}>
                      <Icon name={room.icon as IconName} size={20} color={isActive ? colors.primary.wisteriaDark : colors.text.secondary} />
                      <Text style={[styles.roomCardLabel, isActive && styles.roomCardLabelActive]} numberOfLines={1}>{room.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Room View — VR-style immersive stage: you're inside with your Visby */}
          {currentRoom && (
            <View style={styles.roomStageWrap}>
              <View style={styles.roomStageFrame}>
                {/* Window to the world (castle / cherry sky / etc.) */}
                <LinearGradient
                  colors={[...atmosphere.windowSky]}
                  style={[styles.roomWindowStrip, { height: WINDOW_STRIP_HEIGHT }]}
                  locations={[0, 0.6, 1]}
                >
                  <View style={styles.roomWindowArch} />
                </LinearGradient>
                {/* Wall with depth gradient */}
                <LinearGradient
                  colors={[
                    effectiveWallColor,
                    effectiveWallColor,
                    (country?.accentColor ?? colors.primary.wisteria) + '18',
                  ]}
                  style={[styles.roomWall, { height: WALL_HEIGHT - WINDOW_STRIP_HEIGHT }]}
                  locations={[0, 0.7, 1]}
                >
                  {/* Room title + edit (top) */}
                  <View style={styles.roomNameRow}>
                    <View style={styles.roomNameInner}>
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
                          <Icon name="edit" size={12} color={editMode ? '#FFFFFF' : colors.primary.wisteriaDark} />
                          <Text style={[styles.editToggleText, editMode && styles.editToggleTextActive]}>{editMode ? 'Done' : 'Edit'}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {!editMode && totalInteractive > 0 && (
                      <View style={styles.roomProgressChip}>
                        <Text style={styles.roomProgressText}>{roomInteracted}/{totalInteractive}</Text>
                      </View>
                    )}
                  </View>

                  {/* Interactive objects — in-world style */}
                  <View style={[styles.objectsLayer, { height: (WALL_HEIGHT - WINDOW_STRIP_HEIGHT) - 48 }]}>
                    {currentRoom.objects.map((obj) => {
                      const wasInteracted = interactedObjects.has(obj.id);
                      const isInteractive = obj.interactive && !editMode;
                      return (
                        <TouchableOpacity
                          key={obj.id}
                          style={[
                            styles.roomObject,
                            isInteractive && styles.roomObjectInteractive,
                            wasInteracted && styles.roomObjectDone,
                            { left: `${obj.x}%` as any, top: `${obj.y}%` as any },
                          ]}
                          onPress={() => isInteractive ? handleObjectTap(obj) : undefined}
                          activeOpacity={isInteractive ? 0.8 : 1}
                          disabled={!isInteractive}
                        >
                          <View style={[styles.roomObjectIconWrap, isInteractive && !wasInteracted && styles.roomObjectIconWrapGlow]}>
                            <Icon name={obj.icon as IconName} size={28} color={wasInteracted ? colors.success.emerald : colors.text.primary} />
                          </View>
                          <Text style={[styles.objectLabel, wasInteracted && styles.objectLabelDone]} numberOfLines={2}>{obj.label}</Text>
                          {isInteractive && !wasInteracted && <View style={styles.interactiveDot} />}
                          {isInteractive && wasInteracted && <Icon name="check" size={14} color={colors.success.emerald} style={styles.objectCheck} />}
                        </TouchableOpacity>
                      );
                    })}

                    {placedItems.map((placed) => {
                      const catalogItem = FURNITURE_CATALOG.find(f => f.id === placed.furnitureId);
                      if (!catalogItem) return null;
                      const canInteract = !editMode && catalogItem.interactionType;
                      return (
                        <TouchableOpacity
                          key={placed.id}
                          style={[
                            styles.placedFurnitureItem,
                            { left: `${placed.x}%` as any, top: `${placed.y}%` as any },
                            selectedPlacedItem === placed.id && styles.placedFurnitureItemSelected,
                            canInteract && styles.placedFurnitureItemInteractive,
                          ]}
                          onPress={() => {
                            if (editMode) setSelectedPlacedItem(selectedPlacedItem === placed.id ? null : placed.id);
                            else if (catalogItem.interactionType) setActiveFurnitureInteraction({ placed, catalogItem });
                          }}
                          activeOpacity={editMode || canInteract ? 0.8 : 1}
                          disabled={false}
                        >
                          {catalogItem.interactionType ? (
                            <FurnitureVisual
                              interactionType={catalogItem.interactionType}
                              icon={catalogItem.icon as IconName}
                              size="medium"
                              showHint={true}
                            />
                          ) : (
                            <View style={styles.placedFurnitureIconWrap}>
                              <Icon name={catalogItem.icon as IconName} size={26} color={colors.text.primary} />
                            </View>
                          )}
                          <Text style={styles.placedFurnitureLabel} numberOfLines={1}>{catalogItem.name}</Text>
                          {canInteract && (
                            <View style={styles.useFurnitureBadge}>
                              <Icon name="sparkles" size={10} color={colors.primary.wisteriaDark} />
                              <Text style={styles.useFurnitureBadgeText}>Use</Text>
                            </View>
                          )}
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
                </LinearGradient>

                {/* Baseboard */}
                <View style={[styles.baseboard, { backgroundColor: effectiveFloorColor }]} />

                {/* Floor with subtle gradient */}
                <LinearGradient
                  colors={[effectiveFloorColor, effectiveFloorColor, (country?.accentColor ?? '#000') + '08']}
                  style={styles.roomFloor}
                  locations={[0, 0.6, 1]}
                >
                  {!editMode && (
                    <Animated.View style={[styles.avatarContainer, avatarStyle]}>
                      <View style={styles.visbyShadow} />
                      <View style={styles.visbyCompanionWrap}>
                        <VisbyCharacter
                          appearance={defaultAppearance}
                          equipped={visby?.equipped}
                          mood="curious"
                          size={AVATAR_SIZE}
                          animated
                        />
                        <View style={styles.visbyCompanionLabel}>
                          <Text style={styles.visbyCompanionText}>Your Visby</Text>
                        </View>
                      </View>
                    </Animated.View>
                  )}
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
                            size={18}
                            color={activeEditTab === tab ? '#FFFFFF' : colors.primary.wisteriaDark}
                          />
                          <Text style={[styles.editToolbarLabel, activeEditTab === tab && styles.editToolbarLabelActive]}>
                            {tab === 'furniture' ? 'Furniture' : tab === 'wallpaper' ? 'Wall' : 'Floor'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.walkControls}>
                      <TouchableOpacity style={styles.walkBtn} onPress={moveLeft} activeOpacity={0.8}>
                        <Icon name="chevronLeft" size={26} color={colors.primary.wisteriaDark} />
                      </TouchableOpacity>
                      <Text style={styles.walkLabel}>Walk</Text>
                      <TouchableOpacity style={styles.walkBtn} onPress={moveRight} activeOpacity={0.8}>
                        <Icon name="chevronRight" size={26} color={colors.primary.wisteriaDark} />
                      </TouchableOpacity>
                    </View>
                  )}
                </LinearGradient>

                {/* Room doors */}
                {currentRoomIdx > 0 && (
                  <TouchableOpacity style={styles.roomNavLeft} onPress={() => goToRoom(currentRoomIdx - 1)}>
                    <View style={styles.doorCard}>
                      <Icon name="chevronLeft" size={18} color={colors.primary.wisteriaDark} />
                      <Text style={styles.doorLabel} numberOfLines={1}>{rooms[currentRoomIdx - 1].name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {currentRoomIdx < rooms.length - 1 && (
                  <TouchableOpacity style={styles.roomNavRight} onPress={() => goToRoom(currentRoomIdx + 1)}>
                    <View style={styles.doorCard}>
                      <Text style={styles.doorLabel} numberOfLines={1}>{rooms[currentRoomIdx + 1].name}</Text>
                      <Icon name="chevronRight" size={18} color={colors.primary.wisteriaDark} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Quick Actions — hero quiz + compact row */}
          <View style={styles.actionsWrap}>
            <TouchableOpacity style={styles.heroQuizCard} onPress={startQuiz} activeOpacity={0.9}>
              <LinearGradient
                colors={[colors.primary.wisteriaFaded, colors.surface.lavender, colors.calm.skyLight]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.heroQuizInner}>
                <View style={styles.heroQuizIconWrap}>
                  <Icon name="quiz" size={32} color={colors.primary.wisteriaDark} />
                </View>
                <View style={styles.heroQuizText}>
                  <Text style={styles.heroQuizLabel}>Take the quiz</Text>
                  <Text style={styles.heroQuizSub}>+{QUIZ_AURA_PER_CORRECT} Aura per correct answer</Text>
                </View>
                <Icon name="chevronRight" size={22} color={colors.primary.wisteriaDark} />
              </View>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsChipsRow}>
              <TouchableOpacity style={styles.actionChip} onPress={() => navigation.navigate('CountryMap', { countryId })}>
                <Icon name="compass" size={18} color={colors.primary.wisteriaDark} />
                <Text style={styles.actionChipLabel}>Map</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionChip} onPress={() => setShowGamesModal(true)}>
                <Icon name="sparkles" size={18} color={colors.reward.gold} />
                <Text style={styles.actionChipLabel}>Mini-Games</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionChip} onPress={() => { if (facts.length > 0) { setFactIndex(0); openFact(facts[0]); } }}>
                <Icon name="book" size={18} color={colors.calm.ocean} />
                <Text style={styles.actionChipLabel}>Facts ({readFacts.size}/{facts.length})</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionChip}
                onPress={() => {
                  if (isViewingFriendHouse) navigation.goBack();
                  else if (isOwner) setEditMode(true);
                  else navigation.navigate('CountryWorld');
                }}
              >
                <Icon
                  name={isViewingFriendHouse ? 'chevronLeft' : isOwner ? 'edit' : 'home'}
                  size={18}
                  color={isViewingFriendHouse ? colors.text.secondary : isOwner ? colors.success.emerald : colors.reward.peachDark}
                />
                <Text style={styles.actionChipLabel}>
                  {isViewingFriendHouse ? 'Leave' : isOwner ? 'Decorate' : 'Get House'}
                </Text>
              </TouchableOpacity>
              {locations.length > 0 && (
                <TouchableOpacity style={styles.actionChip} onPress={() => setShowLocationsModal(true)}>
                  <Icon name="landmark" size={18} color={colors.reward.peachDark} />
                  <Text style={styles.actionChipLabel}>Stops ({visitedLocations.size}/{locations.length})</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
            {/* Who's here + Chat (Club Penguin style): when real-time is connected, friends in the same place can chat */}
            <View style={styles.liveStrip}>
              <Icon name="people" size={14} color={colors.text.muted} />
              <Caption style={styles.liveStripText}>When friends are here, you can see who's online and chat — Club Penguin style!</Caption>
            </View>
          </View>

          {/* Fun Facts */}
          <View style={styles.factsSection}>
            <Text style={styles.sectionTitle}>Fun facts about {country.name}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.factsScroll}>
              {facts.map((fact, index) => {
                const isRead = readFacts.has(fact.id);
                return (
                  <TouchableOpacity
                    key={fact.id}
                    style={[styles.factChip, { borderColor: (country?.accentColor ?? colors.primary.wisteria) + '60' }, isRead && styles.factChipRead]}
                    onPress={() => { setFactIndex(index); openFact(fact); }}
                  >
                    <Icon name={fact.icon as any} size={18} color={colors.primary.wisteriaDark} />
                    <Text variant="caption" numberOfLines={1} style={isRead ? styles.factTextRead : undefined}>{fact.title}</Text>
                    {isRead && <Icon name="check" size={14} color={colors.success.emerald} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Earning guide — compact */}
          <View style={styles.guideSection}>
            <Text style={styles.sectionTitle}>Earn Aura here</Text>
            <View style={styles.guideGrid}>
              <View style={styles.guideItem}>
                <Icon name="food" size={22} color={colors.reward.peachDark} />
                <Text style={styles.guideLabel}>Use furniture</Text>
                <Text style={styles.guideAmount}>Eat, cook, rest + Aura</Text>
              </View>
              <View style={styles.guideItem}>
                <Icon name="home" size={22} color={colors.primary.wisteriaDark} />
                <Text style={styles.guideLabel}>Explore objects</Text>
                <Text style={styles.guideAmount}>+8 each</Text>
              </View>
              <View style={styles.guideItem}>
                <Icon name="quiz" size={22} color={colors.primary.wisteriaDark} />
                <Text style={styles.guideLabel}>Quiz</Text>
                <Text style={styles.guideAmount}>+{QUIZ_AURA_PER_CORRECT}/correct</Text>
              </View>
              <View style={styles.guideItem}>
                <Icon name="book" size={22} color={colors.primary.wisteriaDark} />
                <Text style={styles.guideLabel}>Facts</Text>
                <Text style={styles.guideAmount}>+{FACT_AURA_REWARD} each</Text>
              </View>
              <View style={styles.guideItem}>
                <Icon name="flame" size={22} color={colors.status.streak} />
                <Text style={styles.guideLabel}>Streak</Text>
                <Text style={styles.guideAmount}>{multiplier.toFixed(1)}x</Text>
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

      {/* Furniture use modal — eat at table, cook, rest, study, play */}
      <Modal visible={!!activeFurnitureInteraction} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setActiveFurnitureInteraction(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {activeFurnitureInteraction && (() => {
              const { catalogItem } = activeFurnitureInteraction;
              const type = catalogItem.interactionType!;
              const needLabel = type === 'table' || type === 'stove' ? 'Hunger' : type === 'bed' ? 'Energy' : type === 'toy' ? 'Happiness' : 'Knowledge';
              const aura = catalogItem.interactionAura ?? 15;
              const totalAura = Math.round(aura * multiplier);
              return (
                <>
                  <View style={styles.modalIconRow}>
                    <FurnitureVisual interactionType={type} icon={catalogItem.icon as IconName} size="large" showHint={true} />
                  </View>
                  <Heading level={3}>{catalogItem.interactionLabel ?? `Use ${catalogItem.name}`}</Heading>
                  <Text variant="body" style={styles.modalBody}>
                    Your Visby will love this. Fills {needLabel} and earns you Aura.
                  </Text>
                  <View style={[styles.auraEarnedRow, { marginBottom: spacing.md }]}>
                    <Text style={styles.auraEarnedText}>+{totalAura} Aura</Text>
                    {multiplier > 1 && (
                      <Text style={styles.auraEarnedSubtext}>{multiplier.toFixed(1)}x streak bonus</Text>
                    )}
                  </View>
                  <View style={styles.modalActions}>
                    <Button size="sm" variant="secondary" title="Cancel" onPress={() => setActiveFurnitureInteraction(null)} />
                    <Button size="sm" variant="primary" title="Do it!" onPress={() => handleUseFurniture(type, aura)} />
                  </View>
                </>
              );
            })()}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Fact modal — dreamy, with picture of what you're learning */}
      <Modal visible={!!learningFact} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={closeFact}>
          <Pressable style={styles.factModalCard} onPress={(e) => e.stopPropagation()}>
            {learningFact && (
              <>
                <LinearGradient
                  colors={[colors.surface.lavender, colors.base.cream, colors.calm.skyLight]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                {learningFact.imageUrl ? (
                  <View style={styles.factImageWrap}>
                    <Image source={{ uri: learningFact.imageUrl }} style={styles.factImage} resizeMode="cover" />
                    <View style={styles.factImageOverlay} />
                  </View>
                ) : (
                  <View style={styles.factIconWrap}>
                    <Icon name={learningFact.icon as IconName} size={48} color={colors.primary.wisteriaDark} />
                  </View>
                )}
                <View style={styles.factModalBody}>
                  <Heading level={2} style={styles.factModalTitle}>{learningFact.title}</Heading>
                  <Text variant="body" style={styles.factModalContent}>{learningFact.content}</Text>
                  <View style={styles.auraEarnedRow}>
                    <Icon name="sparkles" size={18} color={colors.reward.gold} />
                    <Text style={styles.auraEarnedText}>+{FACT_AURA_REWARD} Aura</Text>
                  </View>
                  <View style={styles.modalActions}>
                    {facts.length > 1 && (
                      <Button size="sm" variant="secondary" title="Next fact" onPress={nextFact} />
                    )}
                    <Button size="sm" variant="primary" title="Got it!" onPress={closeFact} />
                  </View>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Furniture Panel */}
      <Modal visible={showFurniturePanel} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => { setShowFurniturePanel(false); setNotEnoughAuraFor(null); }}>
          <Pressable style={styles.panelContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.panelHeader}>
              <Heading level={3}>Furniture</Heading>
              <TouchableOpacity onPress={() => { setShowFurniturePanel(false); setNotEnoughAuraFor(null); }}>
                <Icon name="close" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.furniturePanelHint}>Place in your room — tap tables, stoves & beds to fill Visby's needs and earn Aura. Traditional furniture unlocks when you visit new places!</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.furnitureGrid}>
              {[...getAvailableFurniture(user?.visitedCountries ?? [])]
                .sort((a, b) => (a.interactionType ? 0 : 1) - (b.interactionType ? 0 : 1))
                .map((item) => {
                  const owned = ownedFurniture.includes(item.id);
                  const isFunctional = !!item.interactionType;
                  const showNotEnoughAura = notEnoughAuraFor === item.id;
                  return (
                    <View key={item.id} style={[styles.furnitureCard, isFunctional && styles.furnitureCardFunctional]}>
                      <View style={styles.furnitureIconWrap}>
                        {isFunctional ? (
                          <FurnitureVisual interactionType={item.interactionType!} icon={item.icon as IconName} size="small" showHint />
                        ) : (
                          <Icon name={item.icon as IconName} size={32} color={colors.text.primary} />
                        )}
                      </View>
                      <Text style={styles.furnitureName} numberOfLines={1}>{item.name}</Text>
                      {isFunctional && item.interactionLabel && (
                        <Text style={styles.furnitureInteractionHint} numberOfLines={2}>{item.interactionLabel}</Text>
                      )}
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
                            setNotEnoughAuraFor(null);
                          }}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.placeBtnText}>Place</Text>
                        </TouchableOpacity>
                      ) : (
                        <>
                          <TouchableOpacity
                            style={styles.buyBtn}
                            onPress={() => {
                              setNotEnoughAuraFor(null);
                              const ok = buyFurniture(item.id, item.price);
                              if (!ok) setNotEnoughAuraFor(item.id);
                            }}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.buyBtnText}>{item.price} Aura</Text>
                          </TouchableOpacity>
                          {showNotEnoughAura && (
                            <Text style={styles.furnitureNotEnoughAura}>Need {item.price} Aura</Text>
                          )}
                        </>
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

      {/* Games Modal */}
      <Modal visible={showGamesModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowGamesModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Heading level={3} style={{ textAlign: 'center', marginBottom: spacing.md }}>Mini-Games</Heading>
            <View style={styles.gamesGrid}>
              {[
                { key: 'WordMatch', name: 'Word Match', icon: 'language', desc: 'Match foreign words', color: colors.primary.wisteriaDark },
                { key: 'MemoryCards', name: 'Memory', icon: 'flashcard', desc: 'Flip and match pairs', color: colors.calm.ocean },
                { key: 'CookingGame', name: 'Cooking', icon: 'food', desc: 'Cook world recipes', color: colors.reward.peachDark },
                { key: 'TreasureHunt', name: 'Treasure Hunt', icon: 'compass', desc: 'Find hidden items', color: colors.success.emerald },
              ].map((game) => (
                <TouchableOpacity
                  key={game.key}
                  style={styles.gamePickCard}
                  onPress={() => {
                    setShowGamesModal(false);
                    (navigation.getParent() as any)?.getParent()?.navigate(game.key as any, { countryId });
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.gamePickIcon, { backgroundColor: game.color + '20' }]}>
                    <Icon name={game.icon as any} size={24} color={game.color} />
                  </View>
                  <Text style={styles.gamePickName}>{game.name}</Text>
                  <Caption>{game.desc}</Caption>
                </TouchableOpacity>
              ))}
            </View>
            <Button title="Close" variant="secondary" onPress={() => setShowGamesModal(false)} style={{ marginTop: spacing.md }} />
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
                  {quizQuestions[quizIndex].imageUrl ? (
                    <View style={styles.quizQuestionImageWrap}>
                      <Image source={{ uri: quizQuestions[quizIndex].imageUrl }} style={styles.quizQuestionImage} resizeMode="cover" />
                    </View>
                  ) : null}
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
                {isPlaceComplete && (
                  <View style={styles.quizPlaceCompleteRow}>
                    <Icon name="trophy" size={20} color={colors.reward.gold} />
                    <Text style={styles.quizPlaceCompleteText}>You've mastered {country?.name}! Explore the next place.</Text>
                  </View>
                )}
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
      {/* Locations Modal */}
      <Modal visible={showLocationsModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowLocationsModal(false)}>
          <Pressable style={styles.panelContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.panelHeader}>
              <Heading level={3}>Stops to Visit</Heading>
              <TouchableOpacity onPress={() => setShowLocationsModal(false)}>
                <Icon name="close" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.locationsGrid}>
              {locations.map((loc) => {
                const visited = visitedLocations.has(loc.id);
                const catIcon = LOCATION_CATEGORY_ICONS[loc.category];
                return (
                  <TouchableOpacity
                    key={loc.id}
                    style={[styles.locationCard, visited && styles.locationCardVisited]}
                    onPress={() => handleVisitLocation(loc)}
                    activeOpacity={visited ? 1 : 0.8}
                  >
                    <View style={styles.locationIconWrap}>
                      <Icon name={catIcon} size={36} color={visited ? '#4CAF50' : colors.text.primary} />
                    </View>
                    <View style={styles.locationInfo}>
                      <View style={styles.locationNameRow}>
                        <Text style={styles.locationName} numberOfLines={1}>{loc.name}</Text>
                        {visited && <Icon name="check" size={16} color="#4CAF50" />}
                      </View>
                      <Text style={styles.locationDesc} numberOfLines={2}>{loc.description}</Text>
                      <View style={styles.locationMeta}>
                        <View style={styles.locationCategoryChip}>
                          <Icon name={catIcon} size={12} color={colors.text.secondary} />
                          <Text style={styles.locationCategoryText}>{loc.category.replace('_', ' ')}</Text>
                        </View>
                        <View style={[styles.locationLpBadge, visited && styles.locationLpBadgeVisited]}>
                          <Text style={[styles.locationLpText, visited && styles.locationLpTextVisited]}>
                            {visited ? 'Visited' : `+${loc.learningPoints} LP`}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
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
  ownerTag: { color: colors.success.emerald, fontFamily: 'Nunito-Bold', fontSize: 12, marginTop: 2 },
  vibeCaption: {
    fontFamily: 'Nunito-Medium',
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 2,
  },
  auraChip: {
    backgroundColor: colors.reward.peachLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.reward.peachDark + '40',
  },
  auraChipText: { fontFamily: 'Baloo2-SemiBold', fontSize: 14, color: colors.reward.gold },

  streakBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    marginHorizontal: spacing.lg, marginBottom: spacing.xs,
    paddingVertical: 6, paddingHorizontal: spacing.md,
    backgroundColor: colors.status.streakBg, borderRadius: 14,
    borderWidth: 1, borderColor: colors.status.streak + '40',
  },
  streakText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.status.streak },
  multiplierBadge: { backgroundColor: colors.reward.gold, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  multiplierText: { fontFamily: 'Baloo2-Bold', fontSize: 12, color: colors.text.primary },
  placeCompleteBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.success.emerald + '40',
    minHeight: 64,
    justifyContent: 'center',
  },
  placeCompleteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  placeCompleteText: { flex: 1 },
  placeCompleteTitle: { fontFamily: 'Baloo2-Bold', fontSize: 16, color: colors.text.primary },
  placeCompleteSub: { fontFamily: 'Nunito-Medium', fontSize: 12, color: colors.text.secondary, marginTop: 2 },

  // Room cards (choose room)
  roomCardsRow: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingVertical: spacing.sm },
  roomCard: {
    width: 96,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface.card,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  roomCardActive: {
    borderColor: colors.primary.wisteria,
    shadowColor: colors.primary.wisteria,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  roomCardSwatch: {
    height: 36,
    width: '100%',
  },
  roomCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  roomCardLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 11, color: colors.text.secondary, flex: 1 },
  roomCardLabelActive: { color: colors.primary.wisteriaDark, fontFamily: 'Nunito-Bold' },

  // Room stage (immersive)
  roomStageWrap: { marginHorizontal: spacing.md, marginBottom: spacing.sm },
  roomStageFrame: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: ROOM_HEIGHT,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  roomWall: {
    paddingTop: spacing.xs,
  },
  roomWindowStrip: {
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  roomWindowArch: {
    width: '70%',
    height: 12,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  baseboard: {
    height: 6,
    width: '100%',
  },
  roomFloor: {
    height: FLOOR_HEIGHT,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomNameRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  roomNameInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roomNameText: { fontFamily: 'Baloo2-SemiBold', fontSize: 17, color: colors.text.primary },
  roomProgressChip: {
    backgroundColor: colors.success.honeydew,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.success.emerald + '40',
  },
  roomProgressText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: colors.success.emerald },
  editToggleText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: colors.primary.wisteriaDark },
  editToggleTextActive: { color: '#FFFFFF' },

  // Objects (in-world style)
  objectsLayer: {
    position: 'relative',
    marginTop: spacing.xs,
  },
  roomObject: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -28 }, { translateY: -20 }],
    minWidth: 56,
  },
  roomObjectInteractive: {
    // tap target + visual emphasis
  },
  roomObjectDone: {},
  roomObjectIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.shadow.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  roomObjectIconWrapGlow: {
    borderColor: colors.primary.wisteria + '60',
    shadowColor: colors.primary.wisteria,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  objectLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 10, color: colors.text.secondary, textAlign: 'center', maxWidth: 68 },
  objectLabelDone: { color: colors.success.emerald },
  objectCheck: { position: 'absolute', top: -4, right: -4 },
  interactiveDot: {
    position: 'absolute', top: -2, right: -2,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.reward.gold,
    borderWidth: 2, borderColor: '#FFFFFF',
  },
  avatarContainer: {
    position: 'absolute', left: spacing.lg, bottom: 4,
    width: AVATAR_SIZE, height: AVATAR_SIZE + 24,
    alignItems: 'center',
  },
  visbyShadow: {
    position: 'absolute',
    bottom: 20,
    left: (AVATAR_SIZE - 40) / 2,
    width: 40,
    height: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  visbyCompanionWrap: {
    alignItems: 'center',
  },
  visbyCompanionLabel: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary.wisteriaFaded,
  },
  visbyCompanionText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
    color: colors.primary.wisteriaDark,
  },
  walkControls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md,
  },
  walkBtn: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary.wisteriaFaded,
  },
  walkLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.text.muted },

  // Door navigation
  roomNavLeft: { position: 'absolute', left: 6, top: '38%' as any, zIndex: 10 },
  roomNavRight: { position: 'absolute', right: 6, top: '38%' as any, zIndex: 10 },
  doorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary.wisteriaFaded,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  doorLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 11, color: colors.text.secondary, maxWidth: 64 },

  // Quick actions (hero + chips)
  actionsWrap: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.sm },
  heroQuizCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primary.wisteriaFaded,
    minHeight: 72,
    justifyContent: 'center',
  },
  heroQuizInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  heroQuizIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroQuizText: { flex: 1 },
  heroQuizLabel: { fontFamily: 'Baloo2-SemiBold', fontSize: 17, color: colors.text.primary },
  heroQuizSub: { fontFamily: 'Nunito-Medium', fontSize: 13, color: colors.text.secondary, marginTop: 2 },
  actionsChipsRow: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.xs },
  liveStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  liveStripText: { flex: 1, color: colors.text.muted },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surface.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary.wisteriaFaded,
  },
  actionChipLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.text.primary },

  // Games grid (modal)
  gamesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
  },
  gamePickCard: {
    width: '47%' as any, alignItems: 'center', padding: spacing.md,
    backgroundColor: colors.base.cream, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(184, 165, 224, 0.15)',
  },
  gamePickIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  gamePickName: {
    fontFamily: 'Nunito-Bold', fontSize: 13, color: colors.text.primary,
  },

  factsSection: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  sectionTitle: { fontFamily: 'Baloo2-Bold', fontSize: 16, color: colors.text.primary, marginBottom: 8 },
  factsScroll: { gap: spacing.sm, paddingVertical: spacing.xs, paddingRight: spacing.lg },
  factChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 20, borderWidth: 2, backgroundColor: colors.surface.cardWarm,
  },
  factChipRead: { backgroundColor: colors.success.honeydew, borderColor: colors.success.emerald + '50', borderStyle: 'dashed' as any },
  factTextRead: { color: colors.text.muted },
  guideSection: {
    marginHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.xl,
    padding: spacing.lg, backgroundColor: colors.surface.lavender,
    borderRadius: 20, borderWidth: 1, borderColor: colors.primary.wisteriaFaded,
  },
  guideGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  guideItem: {
    width: '46%' as any, alignItems: 'center', padding: spacing.sm,
    backgroundColor: colors.surface.card, borderRadius: 14,
    borderWidth: 1, borderColor: colors.primary.wisteriaFaded,
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
  factModalCard: {
    maxWidth: 360, width: '100%', borderRadius: 28, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.primary.wisteriaFaded,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 8,
  },
  factImageWrap: { width: '100%', height: 180, position: 'relative' },
  factImage: { width: '100%', height: '100%' },
  factImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  factIconWrap: {
    paddingVertical: spacing.lg, alignItems: 'center',
    backgroundColor: colors.primary.wisteriaFaded,
  },
  factModalBody: { padding: spacing.xl },
  factModalTitle: { marginBottom: spacing.sm, textAlign: 'center' },
  factModalContent: { marginBottom: spacing.md, textAlign: 'center', lineHeight: 22 },
  modalIconRow: { alignItems: 'center', marginBottom: spacing.sm },
  modalIcon: { fontSize: 48 },
  modalBody: { marginTop: spacing.sm, marginBottom: spacing.sm },
  auraEarnedRow: {
    alignItems: 'center', paddingVertical: 8, marginBottom: spacing.sm,
    backgroundColor: colors.status.streakBg, borderRadius: 12,
    borderWidth: 1, borderColor: colors.reward.gold + '30',
  },
  auraEarnedText: { fontFamily: 'Baloo2-SemiBold', fontSize: 16, color: colors.status.streak },
  auraEarnedSubtext: { fontFamily: 'Nunito-SemiBold', fontSize: 12, color: colors.reward.gold, marginTop: 2 },
  modalActions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },

  // Quiz modal
  quizModal: {
    backgroundColor: '#FFFFFF', borderRadius: 28,
    padding: spacing.xl, maxWidth: 400, width: '100%', maxHeight: '85%',
  },
  quizProgress: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  quizProgressText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.secondary },
  quizScoreText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.primary.wisteriaDark },
  quizQuestionImageWrap: {
    width: '100%', height: 140, borderRadius: 16, overflow: 'hidden', marginBottom: spacing.md,
    backgroundColor: colors.base.skyLight, borderWidth: 1, borderColor: colors.primary.wisteriaLight + '60',
  },
  quizQuestionImage: { width: '100%', height: '100%' },
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
  quizPlaceCompleteRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    marginBottom: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    backgroundColor: colors.success.honeydew, borderRadius: 14, borderWidth: 1, borderColor: colors.success.emerald + '40',
  },
  quizPlaceCompleteText: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.text.primary, flex: 1 },
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
    transform: [{ translateX: -38 }, { translateY: -22 }],
    padding: 4, borderRadius: 12,
  },
  placedFurnitureItemSelected: {
    backgroundColor: 'rgba(184, 165, 224, 0.25)',
    borderWidth: 1.5, borderColor: colors.primary.wisteria, borderStyle: 'dashed' as any,
  },
  placedFurnitureItemInteractive: {
    padding: 4,
  },
  useFurnitureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary.wisteria + '50',
  },
  useFurnitureBadgeText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
    color: colors.primary.wisteriaDark,
  },
  placedFurnitureIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 2,
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
  furnitureCardFunctional: {
    borderColor: colors.primary.wisteria + '40',
    backgroundColor: colors.surface.lavender,
  },
  furnitureInteractionHint: {
    fontFamily: 'Nunito-Medium',
    fontSize: 9,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
    maxWidth: '100%',
  },
  furniturePanelHint: {
    fontFamily: 'Nunito-Medium',
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  furnitureNotEnoughAura: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    color: colors.status.error,
    marginTop: 4,
    textAlign: 'center',
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

  // Locations
  locationsGrid: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: colors.base.cream,
    borderRadius: 16,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.15)',
    gap: spacing.sm,
  },
  locationCardVisited: {
    backgroundColor: 'rgba(200, 230, 200, 0.3)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  locationIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
    gap: 2,
  },
  locationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationName: {
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  locationDesc: {
    fontFamily: 'Nunito-Medium',
    fontSize: 11,
    color: colors.text.secondary,
    lineHeight: 15,
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  locationCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(184, 165, 224, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  locationCategoryText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    color: colors.text.secondary,
    textTransform: 'capitalize' as any,
  },
  locationLpBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  locationLpBadgeVisited: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  locationLpText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
    color: '#D4760A',
  },
  locationLpTextVisited: {
    color: '#4CAF50',
  },
});
