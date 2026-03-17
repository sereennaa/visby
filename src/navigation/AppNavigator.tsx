import React, { Suspense, useEffect } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { analyticsService } from '../services/analytics';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { getShadowStyle } from '../theme/shadows';
import { Icon, IconName } from '../components/ui/Icon';
import { RootStackParamList, MainTabParamList, ExploreStackParamList } from '../types';
import { useStore } from '../store/useStore';
import { hapticService } from '../services/haptics';

import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';

import { HomeScreen } from '../screens/home/HomeScreen';
import { ExploreScreen } from '../screens/explore/ExploreScreen';
import { InboxScreen } from '../screens/inbox/InboxScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const LazyWorldMapScreen = React.lazy(() => import('../screens/explore/WorldMapScreen'));
const LazyMapScreen = React.lazy(() => import('../screens/explore/MapScreen'));
const LazyCountryWorldScreen = React.lazy(() => import('../screens/world/CountryWorldScreen'));
const LazyCountryRoomScreen = React.lazy(() => import('../screens/world/CountryRoomScreen'));
const LazyCountryMapScreen = React.lazy(() => import('../screens/world/CountryMapScreen'));
const LazyPlaceStreetScreen = React.lazy(() => import('../screens/world/PlaceStreetScreen'));

const LazyStampsScreen = React.lazy(() => import('../screens/collections/StampsScreen'));
const LazyBitesScreen = React.lazy(() => import('../screens/collections/BitesScreen'));
const LazyLearnScreen = React.lazy(() => import('../screens/learn/LearnScreen'));
const LazyStampDetailScreen = React.lazy(() => import('../screens/details/StampDetailScreen'));
const LazyBiteDetailScreen = React.lazy(() => import('../screens/details/BiteDetailScreen'));
const LazyLocationDetailScreen = React.lazy(() => import('../screens/details/LocationDetailScreen'));
const LazyCollectStampScreen = React.lazy(() => import('../screens/actions/CollectStampScreen'));
const LazyAddBiteScreen = React.lazy(() => import('../screens/actions/AddBiteScreen'));
const LazyEditProfileScreen = React.lazy(() => import('../screens/profile/EditProfileScreen'));
const LazyProgressScreen = React.lazy(() => import('../screens/profile/ProgressScreen'));
const LazySkillDetailScreen = React.lazy(() => import('../screens/profile/SkillDetailScreen'));
const LazyDiscoveryLogScreen = React.lazy(() => import('../screens/profile/DiscoveryLogScreen'));
const LazyParentDashboardScreen = React.lazy(() => import('../screens/profile/ParentDashboardScreen'));
const LazyFriendsScreen = React.lazy(() => import('../screens/friends/FriendsScreen'));
const LazyAddFriendScreen = React.lazy(() => import('../screens/friends/AddFriendScreen'));
const LazyFriendProfileScreen = React.lazy(() => import('../screens/friends/FriendProfileScreen'));
const LazyAvatarScreen = React.lazy(() => import('../screens/avatar/AvatarScreen'));
const LazyBadgesScreen = React.lazy(() => import('../screens/badges/BadgesScreen'));
const LazySettingsScreen = React.lazy(() => import('../screens/settings/SettingsScreen'));
const LazyCosmeticShopScreen = React.lazy(() => import('../screens/shop/CosmeticShopScreen'));
const LazyMembershipScreen = React.lazy(() => import('../screens/shop/MembershipScreen'));
const LazyAuraStoreScreen = React.lazy(() => import('../screens/shop/AuraStoreScreen'));
const LazyFurnitureShopScreen = React.lazy(() => import('../screens/shop/FurnitureShopScreen'));
const LazyLessonCategoryScreen = React.lazy(() => import('../screens/learn/LessonCategoryScreen'));
const LazyLessonScreen = React.lazy(() => import('../screens/learn/LessonScreen'));
const LazyQuizScreen = React.lazy(() => import('../screens/learn/QuizScreen'));
const LazyFlashcardsScreen = React.lazy(() => import('../screens/learn/FlashcardsScreen'));
const LazyWordMatchScreen = React.lazy(() => import('../screens/games/WordMatchScreen'));
const LazyMemoryCardsScreen = React.lazy(() => import('../screens/games/MemoryCardsScreen'));
const LazyCookingGameScreen = React.lazy(() => import('../screens/games/CookingGameScreen'));
const LazyTreasureHuntScreen = React.lazy(() => import('../screens/games/TreasureHuntScreen'));
const LazyFlagMatchScreen = React.lazy(() => import('../screens/games/FlagMatchScreen'));
const LazyMapPinScreen = React.lazy(() => import('../screens/games/MapPinScreen'));
const LazyCultureDressUpScreen = React.lazy(() => import('../screens/games/CultureDressUpScreen'));
const LazySortCategorizeScreen = React.lazy(() => import('../screens/games/SortCategorizeScreen'));
const LazyStoryBuilderScreen = React.lazy(() => import('../screens/games/StoryBuilderScreen'));
const LazyLearningPathScreen = React.lazy(() => import('../screens/learn/LearningPathScreen'));
const LazyShopHubScreen = React.lazy(() => import('../screens/shop/ShopHubScreen'));

class ScreenErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    try {
      analyticsService.logError('screen_crash', {
        message: error.message,
        stack: error.stack?.slice(0, 500),
        componentStack: errorInfo.componentStack?.slice(0, 500),
      });
    } catch (_) {}
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorWrap}>
          <Text style={styles.errorEmoji}>{'\u26A0\uFE0F'}</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMsg}>This screen ran into an issue.</Text>
          <TouchableOpacity
            style={styles.errorBtn}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.errorBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

function SuspenseScreen(LazyComponent: React.LazyExoticComponent<any>) {
  return function WrappedScreen(props: any) {
    return (
      <ScreenErrorBoundary>
        <Suspense fallback={<View style={styles.loadingWrap}><ActivityIndicator size="large" color={colors.primary.wisteria} /></View>}>
          <LazyComponent {...props} />
        </Suspense>
      </ScreenErrorBoundary>
    );
  };
}

const WorldMapScreen = SuspenseScreen(LazyWorldMapScreen);
const MapScreen = SuspenseScreen(LazyMapScreen);
const CountryWorldScreen = SuspenseScreen(LazyCountryWorldScreen);
const CountryRoomScreen = SuspenseScreen(LazyCountryRoomScreen);
const CountryMapScreen = SuspenseScreen(LazyCountryMapScreen);
const PlaceStreetScreen = SuspenseScreen(LazyPlaceStreetScreen);
const StampsScreen = SuspenseScreen(LazyStampsScreen);
const BitesScreen = SuspenseScreen(LazyBitesScreen);
const LearnScreen = SuspenseScreen(LazyLearnScreen);
const StampDetailScreen = SuspenseScreen(LazyStampDetailScreen);
const BiteDetailScreen = SuspenseScreen(LazyBiteDetailScreen);
const LocationDetailScreen = SuspenseScreen(LazyLocationDetailScreen);
const CollectStampScreen = SuspenseScreen(LazyCollectStampScreen);
const AddBiteScreen = SuspenseScreen(LazyAddBiteScreen);
const EditProfileScreen = SuspenseScreen(LazyEditProfileScreen);
const ProgressScreen = SuspenseScreen(LazyProgressScreen);
const SkillDetailScreen = SuspenseScreen(LazySkillDetailScreen);
const DiscoveryLogScreen = SuspenseScreen(LazyDiscoveryLogScreen);
const ParentDashboardScreen = SuspenseScreen(LazyParentDashboardScreen);
const FriendsScreen = SuspenseScreen(LazyFriendsScreen);
const AddFriendScreen = SuspenseScreen(LazyAddFriendScreen);
const FriendProfileScreen = SuspenseScreen(LazyFriendProfileScreen);
const AvatarScreen = SuspenseScreen(LazyAvatarScreen);
const BadgesScreen = SuspenseScreen(LazyBadgesScreen);
const SettingsScreen = SuspenseScreen(LazySettingsScreen);
const CosmeticShopScreen = SuspenseScreen(LazyCosmeticShopScreen);
const MembershipScreen = SuspenseScreen(LazyMembershipScreen);
const AuraStoreScreen = SuspenseScreen(LazyAuraStoreScreen);
const FurnitureShopScreen = SuspenseScreen(LazyFurnitureShopScreen);
const LessonCategoryScreen = SuspenseScreen(LazyLessonCategoryScreen);
const LessonScreen = SuspenseScreen(LazyLessonScreen);
const QuizScreen = SuspenseScreen(LazyQuizScreen);
const FlashcardsScreen = SuspenseScreen(LazyFlashcardsScreen);
const WordMatchScreen = SuspenseScreen(LazyWordMatchScreen);
const MemoryCardsScreen = SuspenseScreen(LazyMemoryCardsScreen);
const CookingGameScreen = SuspenseScreen(LazyCookingGameScreen);
const TreasureHuntScreen = SuspenseScreen(LazyTreasureHuntScreen);
const FlagMatchScreen = SuspenseScreen(LazyFlagMatchScreen);
const MapPinScreen = SuspenseScreen(LazyMapPinScreen);
const CultureDressUpScreen = SuspenseScreen(LazyCultureDressUpScreen);
const SortCategorizeScreen = SuspenseScreen(LazySortCategorizeScreen);
const StoryBuilderScreen = SuspenseScreen(LazyStoryBuilderScreen);
const LearningPathScreen = SuspenseScreen(LazyLearningPathScreen);
const ShopHubScreen = SuspenseScreen(LazyShopHubScreen);

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const ExploreStackNav = createNativeStackNavigator<ExploreStackParamList>();

const TabIcon = React.memo<{ focused: boolean; iconName: IconName; iconNameOutline: IconName }>(
  ({ focused, iconName, iconNameOutline }) => {
    const scale = useSharedValue(focused ? 1 : 0.85);
    const indicatorWidth = useSharedValue(focused ? 20 : 0);
    const indicatorOpacity = useSharedValue(focused ? 1 : 0);

    useEffect(() => {
      scale.value = withSpring(focused ? 1.1 : 0.9, { damping: 12, stiffness: 200 });
      indicatorWidth.value = withSpring(focused ? 20 : 0, { damping: 14 });
      indicatorOpacity.value = withTiming(focused ? 1 : 0, { duration: 200 });
      if (focused) hapticService.selection();
    }, [focused]);

    const iconStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const indicatorStyle = useAnimatedStyle(() => ({
      width: indicatorWidth.value,
      opacity: indicatorOpacity.value,
    }));

    return (
      <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        {focused && <View style={styles.focusGlow} />}
        <Animated.View style={iconStyle}>
          <Icon name={focused ? iconName : iconNameOutline} size={24} color={focused ? colors.primary.wisteriaDark : colors.text.muted} />
        </Animated.View>
        <Animated.View style={[styles.focusIndicator, indicatorStyle]} />
      </View>
    );
  },
);

const ExploreStackNavigator = () => (
  <ExploreStackNav.Navigator
    screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.base.cream }, animation: 'slide_from_right' }}
    initialRouteName="ExploreHome"
  >
    <ExploreStackNav.Screen name="ExploreHome" component={ExploreScreen} />
    <ExploreStackNav.Screen name="Map" component={MapScreen} />
    <ExploreStackNav.Screen name="WorldMap" component={WorldMapScreen} />
    <ExploreStackNav.Screen name="CountryWorld" component={CountryWorldScreen} options={{ animation: 'fade_from_bottom' }} />
    <ExploreStackNav.Screen name="CountryRoom" component={CountryRoomScreen} options={{ animation: 'fade_from_bottom' }} />
    <ExploreStackNav.Screen name="CountryMap" component={CountryMapScreen} />
    <ExploreStackNav.Screen name="PlaceStreet" component={PlaceStreetScreen} />
  </ExploreStackNav.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarBackground: () =>
        Platform.OS === 'ios' ? (
          <BlurView intensity={60} tint="systemChromeMaterialLight" style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.tabBarFallbackBg, { pointerEvents: 'none' }]} />
        ),
      tabBarShowLabel: true,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarActiveTintColor: colors.primary.wisteriaDark,
      tabBarInactiveTintColor: colors.text.muted,
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{
      tabBarLabel: 'Home', tabBarAccessibilityLabel: 'Home',
      tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName="homeFilled" iconNameOutline="homeOutline" />,
    }} />
    <Tab.Screen name="Explore" component={ExploreStackNavigator} options={{
      tabBarLabel: 'Explore', tabBarAccessibilityLabel: 'Explore',
      tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName="compass" iconNameOutline="compassOutline" />,
    }} />
    <Tab.Screen name="Inbox" component={InboxScreen} options={{
      tabBarLabel: 'Inbox', tabBarAccessibilityLabel: 'Inbox',
      tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName="mail" iconNameOutline="mailOutline" />,
    }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{
      tabBarLabel: 'Profile', tabBarAccessibilityLabel: 'Profile',
      tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName="person" iconNameOutline="personOutline" />,
    }} />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const currentRoute = navigationRef.getCurrentRoute();
        if (currentRoute?.name) {
          analyticsService.trackScreenView(currentRoute.name);
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.base.cream }, animation: 'slide_from_right' }}
        initialRouteName={isAuthenticated ? 'Main' : 'Welcome'}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Stamps" component={StampsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Bites" component={BitesScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Learn" component={LearnScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="StampDetail" component={StampDetailScreen} />
        <Stack.Screen name="BiteDetail" component={BiteDetailScreen} />
        <Stack.Screen name="LocationDetail" component={LocationDetailScreen} />
        <Stack.Screen name="CollectStamp" component={CollectStampScreen} />
        <Stack.Screen name="AddBite" component={AddBiteScreen} />
        <Stack.Screen name="Avatar" component={AvatarScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Badges" component={BadgesScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="SkillDetail" component={SkillDetailScreen} />
        <Stack.Screen name="DiscoveryLog" component={DiscoveryLogScreen} />
        <Stack.Screen name="Friends" component={FriendsScreen} />
        <Stack.Screen name="AddFriend" component={AddFriendScreen} />
        <Stack.Screen name="FriendProfile" component={FriendProfileScreen} />
        <Stack.Screen name="LessonCategory" component={LessonCategoryScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Lesson" component={LessonScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Flashcards" component={FlashcardsScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="WordMatch" component={WordMatchScreen} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="MemoryCards" component={MemoryCardsScreen} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="CookingGame" component={CookingGameScreen} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="TreasureHunt" component={TreasureHuntScreen} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="FlagMatch" component={FlagMatchScreen} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="MapPin" component={MapPinScreen} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="CultureDressUp" component={CultureDressUpScreen} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="SortCategorize" component={SortCategorizeScreen} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="StoryBuilder" component={StoryBuilderScreen} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="LearningPath" component={LearningPathScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="CosmeticShop" component={CosmeticShopScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="FurnitureShop" component={FurnitureShopScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="AuraStore" component={AuraStoreScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Membership" component={MembershipScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="ShopHub" component={ShopHubScreen} options={{ animation: 'slide_from_bottom' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.base.cream,
  },
  tabBar: {
    position: 'absolute',
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(253, 251, 248, 0.92)',
    borderTopWidth: 0, height: 88, paddingTop: spacing.sm, paddingBottom: spacing.lg + 4,
    elevation: 16, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    ...getShadowStyle({ shadowColor: 'rgba(184, 165, 224, 0.2)', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 1, shadowRadius: 24 }),
  },
  tabBarFallbackBg: {
    backgroundColor: 'rgba(253, 251, 248, 0.95)', borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  tabBarLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 10, marginTop: 2, letterSpacing: 0.3 },
  tabIcon: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxs, position: 'relative' },
  tabIconFocused: {},
  focusGlow: {
    position: 'absolute', width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(184, 165, 224, 0.12)', top: -6,
  },
  focusIndicator: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary.wisteriaDark, marginTop: 4,
    ...getShadowStyle({ shadowColor: colors.primary.wisteria, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6 }),
  },
  errorWrap: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: colors.base.cream,
  },
  errorEmoji: { fontSize: 40, marginBottom: 12 },
  errorTitle: { fontFamily: 'Baloo2-Bold', fontSize: 20, color: colors.text.primary, textAlign: 'center', marginBottom: 6 },
  errorMsg: { fontFamily: 'Nunito-Medium', fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginBottom: 24 },
  errorBtn: { backgroundColor: colors.primary.wisteria, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  errorBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});

export default AppNavigator;
