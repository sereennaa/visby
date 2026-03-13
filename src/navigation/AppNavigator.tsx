import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Icon, IconName } from '../components/ui/Icon';
import { RootStackParamList, MainTabParamList } from '../types';

// Auth Screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { MapScreen } from '../screens/explore/MapScreen';
import { StampsScreen } from '../screens/collections/StampsScreen';
import { BitesScreen } from '../screens/collections/BitesScreen';
import { LearnScreen } from '../screens/learn/LearnScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

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
  // In a real app, you'd check auth state here
  const isAuthenticated = false;

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

        {/* Main App */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* Detail Screens (would add more as needed) */}
        {/* <Stack.Screen name="StampDetail" component={StampDetailScreen} /> */}
        {/* <Stack.Screen name="BiteDetail" component={BiteDetailScreen} /> */}
        {/* <Stack.Screen name="CollectStamp" component={CollectStampScreen} /> */}
        {/* <Stack.Screen name="AddBite" component={AddBiteScreen} /> */}
        {/* <Stack.Screen name="Avatar" component={AvatarScreen} /> */}
        {/* <Stack.Screen name="Lesson" component={LessonScreen} /> */}
        {/* <Stack.Screen name="Quiz" component={QuizScreen} /> */}
        {/* <Stack.Screen name="Flashcards" component={FlashcardsScreen} /> */}
        {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.base.cream,
    borderTopWidth: 0,
    height: 85,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  tabBarLabel: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 10,
    marginTop: spacing.xxs,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxs,
  },
  tabIconFocused: {
    // Additional styles for focused state
  },
  focusIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary.wisteria,
    marginTop: spacing.xxs,
  },
});

export default AppNavigator;
