import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Icon, IconName } from '../components/ui/Icon';
import { RootStackParamList, MainTabParamList } from '../types';
import { useStore } from '../store/useStore';

// Auth Screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';

// Main Screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { MapScreen } from '../screens/explore/MapScreen';
import { StampsScreen } from '../screens/collections/StampsScreen';
import { BitesScreen } from '../screens/collections/BitesScreen';
import { LearnScreen } from '../screens/learn/LearnScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { CountryWorldScreen, CountryRoomScreen } from '../screens/world';

// Detail Screens
import { StampDetailScreen } from '../screens/details/StampDetailScreen';
import { BiteDetailScreen } from '../screens/details/BiteDetailScreen';
import { LocationDetailScreen } from '../screens/details/LocationDetailScreen';

// Action Screens
import { CollectStampScreen } from '../screens/actions/CollectStampScreen';
import { AddBiteScreen } from '../screens/actions/AddBiteScreen';

// Profile Screens
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';

// Feature Screens
import { AvatarScreen } from '../screens/avatar/AvatarScreen';
import { BadgesScreen } from '../screens/badges/BadgesScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

// Shop Screens
import { CosmeticShopScreen } from '../screens/shop/CosmeticShopScreen';
import { MembershipScreen } from '../screens/shop/MembershipScreen';
import { AuraStoreScreen } from '../screens/shop/AuraStoreScreen';
import { FurnitureShopScreen } from '../screens/shop/FurnitureShopScreen';

// Learn Screens
import { LessonCategoryScreen } from '../screens/learn/LessonCategoryScreen';
import { LessonScreen } from '../screens/learn/LessonScreen';
import { QuizScreen } from '../screens/learn/QuizScreen';
import { FlashcardsScreen } from '../screens/learn/FlashcardsScreen';

// Game Screens
import { WordMatchScreen } from '../screens/games/WordMatchScreen';
import { MemoryCardsScreen } from '../screens/games/MemoryCardsScreen';
import { CookingGameScreen } from '../screens/games/CookingGameScreen';
import { TreasureHuntScreen } from '../screens/games/TreasureHuntScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  focused: boolean;
  iconName: IconName;
  iconNameOutline: IconName;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, iconName, iconNameOutline }) => {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {focused && <View style={styles.focusGlow} />}
      <Icon
        name={focused ? iconName : iconNameOutline}
        size={24}
        color={focused ? colors.primary.wisteriaDark : colors.text.muted}
      />
      {focused && <View style={styles.focusIndicator} />}
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={60}
              tint="systemChromeMaterialLight"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.tabBarFallbackBg]} />
          ),
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: colors.primary.wisteriaDark,
        tabBarInactiveTintColor: colors.text.muted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="homeFilled"
              iconNameOutline="homeOutline"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="compass"
              iconNameOutline="compassOutline"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Stamps"
        component={StampsScreen}
        options={{
          tabBarLabel: 'Stamps',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="stamp"
              iconNameOutline="stamp"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Bites"
        component={BitesScreen}
        options={{
          tabBarLabel: 'Bites',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="food"
              iconNameOutline="food"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="book"
              iconNameOutline="bookOutline"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="person"
              iconNameOutline="personOutline"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated } = useStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.base.cream },
          animation: 'slide_from_right',
        }}
        initialRouteName={isAuthenticated ? 'Main' : 'Welcome'}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        {/* Main App */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* Countries & Houses - visit, buy house, walk through (Club Penguin style) */}
        <Stack.Screen name="CountryWorld" component={CountryWorldScreen} />
        <Stack.Screen name="CountryRoom" component={CountryRoomScreen} />

        {/* Detail Screens */}
        <Stack.Screen name="StampDetail" component={StampDetailScreen} />
        <Stack.Screen name="BiteDetail" component={BiteDetailScreen} />
        <Stack.Screen name="LocationDetail" component={LocationDetailScreen} />

        {/* Action Screens */}
        <Stack.Screen name="CollectStamp" component={CollectStampScreen} />
        <Stack.Screen name="AddBite" component={AddBiteScreen} />

        {/* Feature Screens */}
        <Stack.Screen name="Avatar" component={AvatarScreen} />
        <Stack.Screen name="Badges" component={BadgesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />

        {/* Learn Screens */}
        <Stack.Screen name="LessonCategory" component={LessonCategoryScreen} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Flashcards" component={FlashcardsScreen} />

        {/* Mini-Games */}
        <Stack.Screen name="WordMatch" component={WordMatchScreen} />
        <Stack.Screen name="MemoryCards" component={MemoryCardsScreen} />
        <Stack.Screen name="CookingGame" component={CookingGameScreen} />
        <Stack.Screen name="TreasureHunt" component={TreasureHuntScreen} />

        {/* Shop & Membership */}
        <Stack.Screen name="CosmeticShop" component={CosmeticShopScreen} />
        <Stack.Screen name="FurnitureShop" component={FurnitureShopScreen} />
        <Stack.Screen name="AuraStore" component={AuraStoreScreen} />
        <Stack.Screen name="Membership" component={MembershipScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(253, 251, 248, 0.92)',
    borderTopWidth: 0,
    height: 88,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg + 4,
    shadowColor: 'rgba(184, 165, 224, 0.2)',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  tabBarFallbackBg: {
    backgroundColor: 'rgba(253, 251, 248, 0.95)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  tabBarLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxs,
    position: 'relative',
  },
  tabIconFocused: {},
  focusGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(184, 165, 224, 0.12)',
    top: -6,
  },
  focusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.wisteriaDark,
    marginTop: 4,
    shadowColor: colors.primary.wisteria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});

export default AppNavigator;
