import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

// Icon name mapping - centralized icon system
export const iconMap = {
  // Navigation & General
  home: { family: 'Ionicons', name: 'home' },
  homeFilled: { family: 'Ionicons', name: 'home' },
  homeOutline: { family: 'Ionicons', name: 'home-outline' },
  map: { family: 'Ionicons', name: 'map' },
  mapOutline: { family: 'Ionicons', name: 'map-outline' },
  compass: { family: 'Ionicons', name: 'compass' },
  compassOutline: { family: 'Ionicons', name: 'compass-outline' },
  book: { family: 'Ionicons', name: 'book' },
  bookOutline: { family: 'Ionicons', name: 'book-outline' },
  person: { family: 'Ionicons', name: 'person' },
  personOutline: { family: 'Ionicons', name: 'person-outline' },
  people: { family: 'Ionicons', name: 'people' },
  settings: { family: 'Ionicons', name: 'settings' },
  settingsOutline: { family: 'Ionicons', name: 'settings-outline' },
  back: { family: 'Ionicons', name: 'arrow-back' },
  forward: { family: 'Ionicons', name: 'arrow-forward' },
  chevronRight: { family: 'Ionicons', name: 'chevron-forward' },
  chevronLeft: { family: 'Ionicons', name: 'chevron-back' },
  close: { family: 'Ionicons', name: 'close' },
  check: { family: 'Ionicons', name: 'checkmark' },
  checkCircle: { family: 'Ionicons', name: 'checkmark-circle' },
  add: { family: 'Ionicons', name: 'add' },
  remove: { family: 'Ionicons', name: 'remove' },
  refresh: { family: 'Ionicons', name: 'refresh' },
  search: { family: 'Ionicons', name: 'search' },
  filter: { family: 'Ionicons', name: 'filter' },
  grid: { family: 'Ionicons', name: 'grid' },
  list: { family: 'Ionicons', name: 'list' },
  menu: { family: 'Ionicons', name: 'menu' },
  
  // Auth & User
  mail: { family: 'Ionicons', name: 'mail' },
  mailOutline: { family: 'Ionicons', name: 'mail-outline' },
  lock: { family: 'Ionicons', name: 'lock-closed' },
  lockOutline: { family: 'Ionicons', name: 'lock-closed-outline' },
  eye: { family: 'Ionicons', name: 'eye' },
  eyeOff: { family: 'Ionicons', name: 'eye-off' },
  key: { family: 'Ionicons', name: 'key' },
  tag: { family: 'Ionicons', name: 'pricetag' },
  edit: { family: 'Feather', name: 'edit-2' },
  camera: { family: 'Ionicons', name: 'camera' },
  image: { family: 'Ionicons', name: 'image' },
  
  // Stamps & Location
  stamp: { family: 'MaterialCommunityIcons', name: 'stamper' },
  location: { family: 'Ionicons', name: 'location' },
  locationOutline: { family: 'Ionicons', name: 'location-outline' },
  pin: { family: 'Ionicons', name: 'pin' },
  navigate: { family: 'Ionicons', name: 'navigate' },
  globe: { family: 'Ionicons', name: 'globe' },
  globeOutline: { family: 'Ionicons', name: 'globe-outline' },
  airplane: { family: 'Ionicons', name: 'airplane' },
  
  // Stamp Types
  city: { family: 'MaterialCommunityIcons', name: 'city' },
  country: { family: 'Ionicons', name: 'earth' },
  landmark: { family: 'MaterialCommunityIcons', name: 'eiffel-tower' },
  park: { family: 'MaterialCommunityIcons', name: 'tree' },
  beach: { family: 'MaterialCommunityIcons', name: 'beach' },
  mountain: { family: 'MaterialCommunityIcons', name: 'image-filter-hdr' },
  museum: { family: 'MaterialCommunityIcons', name: 'bank' },
  restaurant: { family: 'Ionicons', name: 'restaurant' },
  cafe: { family: 'MaterialCommunityIcons', name: 'coffee' },
  market: { family: 'MaterialCommunityIcons', name: 'shopping' },
  temple: { family: 'MaterialCommunityIcons', name: 'temple-buddhist' },
  castle: { family: 'MaterialCommunityIcons', name: 'castle' },
  monument: { family: 'MaterialCommunityIcons', name: 'pillar' },
  nature: { family: 'MaterialCommunityIcons', name: 'leaf' },
  hiddenGem: { family: 'MaterialCommunityIcons', name: 'diamond-stone' },
  
  // Food & Bites
  food: { family: 'MaterialCommunityIcons', name: 'food' },
  foodFork: { family: 'MaterialCommunityIcons', name: 'food-fork-drink' },
  bowl: { family: 'MaterialCommunityIcons', name: 'bowl-mix' },
  mainDish: { family: 'MaterialCommunityIcons', name: 'food-turkey' },
  appetizer: { family: 'MaterialCommunityIcons', name: 'food-croissant' },
  dessert: { family: 'MaterialCommunityIcons', name: 'cupcake' },
  snack: { family: 'MaterialCommunityIcons', name: 'popcorn' },
  drink: { family: 'MaterialCommunityIcons', name: 'cup' },
  streetFood: { family: 'MaterialCommunityIcons', name: 'taco' },
  breakfast: { family: 'MaterialCommunityIcons', name: 'egg-fried' },
  soup: { family: 'MaterialCommunityIcons', name: 'pot-steam' },
  salad: { family: 'MaterialCommunityIcons', name: 'food-apple' },
  bread: { family: 'MaterialCommunityIcons', name: 'baguette' },
  recipe: { family: 'MaterialCommunityIcons', name: 'notebook' },
  homemade: { family: 'Ionicons', name: 'home' },
  
  // Gamification
  star: { family: 'Ionicons', name: 'star' },
  starOutline: { family: 'Ionicons', name: 'star-outline' },
  starHalf: { family: 'Ionicons', name: 'star-half' },
  trophy: { family: 'Ionicons', name: 'trophy' },
  trophyOutline: { family: 'Ionicons', name: 'trophy-outline' },
  medal: { family: 'MaterialCommunityIcons', name: 'medal' },
  ribbon: { family: 'Ionicons', name: 'ribbon' },
  sparkles: { family: 'Ionicons', name: 'sparkles' },
  flash: { family: 'Ionicons', name: 'flash' },
  flame: { family: 'Ionicons', name: 'flame' },
  heart: { family: 'Ionicons', name: 'heart' },
  heartOutline: { family: 'Ionicons', name: 'heart-outline' },
  gift: { family: 'Ionicons', name: 'gift' },
  giftOutline: { family: 'Ionicons', name: 'gift-outline' },
  
  // Learning
  school: { family: 'Ionicons', name: 'school' },
  language: { family: 'MaterialCommunityIcons', name: 'translate' },
  chat: { family: 'Ionicons', name: 'chatbubble' },
  culture: { family: 'MaterialCommunityIcons', name: 'theater' },
  history: { family: 'MaterialCommunityIcons', name: 'scroll' },
  etiquette: { family: 'MaterialCommunityIcons', name: 'bow-tie' },
  geography: { family: 'MaterialCommunityIcons', name: 'map-legend' },
  funFacts: { family: 'Ionicons', name: 'bulb' },
  flashcard: { family: 'MaterialCommunityIcons', name: 'cards' },
  quiz: { family: 'MaterialCommunityIcons', name: 'head-question' },
  target: { family: 'MaterialCommunityIcons', name: 'target' },
  
  // Social
  share: { family: 'Ionicons', name: 'share-social' },
  shareOutline: { family: 'Ionicons', name: 'share-social-outline' },
  like: { family: 'Ionicons', name: 'thumbs-up' },
  comment: { family: 'Ionicons', name: 'chatbubble-ellipses' },
  send: { family: 'Ionicons', name: 'send' },
  mailSend: { family: 'MaterialCommunityIcons', name: 'email-send' },
  mailOpen: { family: 'MaterialCommunityIcons', name: 'email-open' },
  
  // Misc
  calendar: { family: 'Ionicons', name: 'calendar' },
  time: { family: 'Ionicons', name: 'time' },
  notification: { family: 'Ionicons', name: 'notifications' },
  notificationOutline: { family: 'Ionicons', name: 'notifications-outline' },
  volumeHigh: { family: 'Ionicons', name: 'volume-high' },
  volumeOff: { family: 'Ionicons', name: 'volume-mute' },
  info: { family: 'Ionicons', name: 'information-circle' },
  infoOutline: { family: 'Ionicons', name: 'information-circle-outline' },
  warning: { family: 'Ionicons', name: 'warning' },
  help: { family: 'Ionicons', name: 'help-circle' },
  logout: { family: 'Ionicons', name: 'log-out' },
  construct: { family: 'Ionicons', name: 'construct' },
  wallet: { family: 'Ionicons', name: 'wallet' },
  shirt: { family: 'Ionicons', name: 'shirt' },
  rocket: { family: 'Ionicons', name: 'rocket' },
  hand: { family: 'MaterialCommunityIcons', name: 'hand-wave' },
  levelUp: { family: 'MaterialCommunityIcons', name: 'arrow-up-bold-circle' },
  crown: { family: 'MaterialCommunityIcons', name: 'crown' },
  viking: { family: 'MaterialCommunityIcons', name: 'shield-account' },
  backpack: { family: 'MaterialCommunityIcons', name: 'bag-personal' },
  footsteps: { family: 'Ionicons', name: 'footsteps' },
  passport: { family: 'MaterialCommunityIcons', name: 'passport' },
  all: { family: 'MaterialCommunityIcons', name: 'view-grid' },
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.text.primary,
  style,
}) => {
  const iconConfig = iconMap[name];
  
  if (!iconConfig) {
    if (__DEV__) console.warn(`Icon "${name}" not found`);
    return null;
  }

  const { family, name: iconName } = iconConfig;

  const IconComponent = {
    Ionicons,
    MaterialCommunityIcons,
    Feather,
    FontAwesome5,
    MaterialIcons,
  }[family];

  if (!IconComponent) {
    return null;
  }

  return (
    <View style={style}>
      <IconComponent name={iconName as any} size={size} color={color} />
    </View>
  );
};

// Icon with background circle
interface IconBadgeProps extends IconProps {
  backgroundColor?: string;
  padding?: number;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  name,
  size = 24,
  color = colors.text.primary,
  backgroundColor = colors.primary.wisteriaFaded,
  padding = spacing.sm,
  style,
}) => {
  return (
    <View
      style={[
        styles.iconBadge,
        {
          backgroundColor,
          padding,
          borderRadius: (size + padding * 2) / 2,
        },
        style,
      ]}
    >
      <Icon name={name} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Icon;
