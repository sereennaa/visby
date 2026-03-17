import React, { Suspense, useCallback, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { analyticsService } from '../services/analytics';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
import { RootStackParamList, MainTabParamList, ExploreStackParamList } from '../types';
import { useStore } from '../store/useStore';
import { PersistentBottomNav } from '../components/navigation/PersistentBottomNav';
import { VisbyLoader } from '../components/ui/VisbyLoader';
import { Icon } from '../components/ui/Icon';

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
const LazyWeeklyChallengeScreen = React.lazy(() => import('../screens/home/WeeklyChallengeScreen'));
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
          <Icon name="compass" size={48} color={colors.primary.wisteriaDark} />
          <Text style={styles.errorTitle}>Visby tripped over a rock!</Text>
          <Text style={styles.errorMsg}>Don't worry, let's dust off and try that again.</Text>
          <TouchableOpacity
            style={styles.errorBtn}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.errorBtnText}>Try again</Text>
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
        <Suspense fallback={<View style={styles.loadingWrap}><VisbyLoader compact /></View>}>
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
const WeeklyChallengeScreen = SuspenseScreen(LazyWeeklyChallengeScreen);
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

const ExploreStackNavigator = () => (
  <ExploreStackNav.Navigator
    screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.base.cream }, animation: 'slide_from_right' }}
    initialRouteName="ExploreHome"
  >
    <ExploreStackNav.Screen name="ExploreHome" component={ExploreScreen} />
    <ExploreStackNav.Screen name="Map" component={MapScreen} />
    <ExploreStackNav.Screen name="WorldMap" component={WorldMapScreen} />
    <ExploreStackNav.Screen name="CountryWorld" component={CountryWorldScreen} options={{ animation: 'fade_from_bottom', animationDuration: 300 }} />
    <ExploreStackNav.Screen name="CountryRoom" component={CountryRoomScreen} options={{ animation: 'fade', animationDuration: 350 }} />
    <ExploreStackNav.Screen name="CountryMap" component={CountryMapScreen} />
    <ExploreStackNav.Screen name="PlaceStreet" component={PlaceStreetScreen} />
  </ExploreStackNav.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { display: 'none' as const, height: 0 },
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Explore" component={ExploreStackNavigator} />
    <Tab.Screen name="Inbox" component={InboxScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AUTH_SCREENS = new Set(['Welcome', 'Login', 'SignUp', 'ForgotPassword', 'Onboarding']);

function getActiveTabFromState(state: any): keyof MainTabParamList {
  const mainRoute = state?.routes?.find((r: any) => r.name === 'Main');
  if (mainRoute?.state) {
    const tabIndex = mainRoute.state.index ?? 0;
    const tabRoute = mainRoute.state.routes?.[tabIndex];
    if (tabRoute?.name) return tabRoute.name as keyof MainTabParamList;
  }
  return 'Home';
}

export const AppNavigator = () => {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState('');
  const [activeTab, setActiveTab] = useState<keyof MainTabParamList>('Home');

  const handleStateChange = useCallback(() => {
    const route = navigationRef.getCurrentRoute();
    if (route?.name) {
      setCurrentRoute(route.name);
      analyticsService.trackScreenView(route.name);
    }
    const state = navigationRef.getRootState();
    setActiveTab(getActiveTabFromState(state));
  }, [navigationRef]);

  const showBottomNav = isAuthenticated && !AUTH_SCREENS.has(currentRoute);

  return (
    <NavigationContainer ref={navigationRef} onStateChange={handleStateChange}>
      <View style={styles.rootLayout}>
        <View style={styles.stackWrap}>
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
            <Stack.Screen name="WeeklyChallenge" component={WeeklyChallengeScreen} options={{ animation: 'slide_from_bottom' }} />
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
            <Stack.Screen name="WordMatch" component={WordMatchScreen} options={{ animation: 'fade_from_bottom', animationDuration: 400 }} />
            <Stack.Screen name="MemoryCards" component={MemoryCardsScreen} options={{ animation: 'fade_from_bottom', animationDuration: 400 }} />
            <Stack.Screen name="CookingGame" component={CookingGameScreen} options={{ animation: 'fade_from_bottom', animationDuration: 400 }} />
            <Stack.Screen name="TreasureHunt" component={TreasureHuntScreen} options={{ animation: 'fade_from_bottom', animationDuration: 400 }} />
            <Stack.Screen name="FlagMatch" component={FlagMatchScreen} options={{ animation: 'fade_from_bottom', animationDuration: 400 }} />
            <Stack.Screen name="MapPin" component={MapPinScreen} options={{ animation: 'fade_from_bottom', animationDuration: 400 }} />
            <Stack.Screen name="CultureDressUp" component={CultureDressUpScreen} options={{ animation: 'fade_from_bottom', animationDuration: 400 }} />
            <Stack.Screen name="SortCategorize" component={SortCategorizeScreen} options={{ animation: 'fade_from_bottom', animationDuration: 400 }} />
            <Stack.Screen name="StoryBuilder" component={StoryBuilderScreen} options={{ animation: 'fade_from_bottom', animationDuration: 400 }} />
            <Stack.Screen name="LearningPath" component={LearningPathScreen} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="CosmeticShop" component={CosmeticShopScreen} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="FurnitureShop" component={FurnitureShopScreen} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="AuraStore" component={AuraStoreScreen} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="Membership" component={MembershipScreen} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="ShopHub" component={ShopHubScreen} options={{ animation: 'slide_from_bottom' }} />
          </Stack.Navigator>
        </View>
        {showBottomNav && (
          <PersistentBottomNav navigationRef={navigationRef} activeTab={activeTab} />
        )}
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  rootLayout: { flex: 1 },
  stackWrap: { flex: 1 },
  loadingWrap: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.base.cream,
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
