import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import {
  Baloo2_400Regular,
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useStore } from './src/store/useStore';
import { supabase, isSupabaseConfigured } from './src/config/supabase';
import { authService } from './src/services/auth';
import { stampsService } from './src/services/stamps';
import { bitesService } from './src/services/bites';
import { colors } from './src/theme/colors';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { setUser, setVisby, setStamps, setBites, setLoading, isLoading } = useStore();

  // Load custom fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Baloo2-Regular': Baloo2_400Regular,
          'Baloo2-Medium': Baloo2_500Medium,
          'Baloo2-SemiBold': Baloo2_600SemiBold,
          'Baloo2-Bold': Baloo2_700Bold,
          'Baloo2-ExtraBold': Baloo2_800ExtraBold,
          'Nunito-Regular': Nunito_400Regular,
          'Nunito-Medium': Nunito_500Medium,
          'Nunito-SemiBold': Nunito_600SemiBold,
          'Nunito-Bold': Nunito_700Bold,
          'Nunito-ExtraBold': Nunito_800ExtraBold,
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Continue anyway with system fonts
      }
    }
    loadFonts();
  }, []);

  // Check for existing session on app load
  useEffect(() => {
    async function checkSession() {
      // Skip auth check if Supabase isn't configured (demo mode)
      if (!isSupabaseConfigured) {
        console.log('Supabase not configured - running in demo mode');
        setLoading(false);
        return;
      }

      try {
        const session = await authService.getSession();
        if (session?.user) {
          // Get user profile and visby
          const profile = await authService.getUserProfile(session.user.id);
          const visby = await authService.getVisby(session.user.id);
          
          if (profile) setUser(profile);
          if (visby) setVisby(visby);

          // Load user collections
          try {
            const [userStamps, userBites] = await Promise.all([
              stampsService.getUserStamps(session.user.id),
              bitesService.getUserBites(session.user.id),
            ]);
            setStamps(userStamps);
            setBites(userBites);
          } catch (e) {
            console.error('Error loading collections:', e);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();

    if (!isSupabaseConfigured) {
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setVisby(null);
        } else if (session?.user && event === 'SIGNED_IN') {
          const profile = await authService.getUserProfile(session.user.id);
          const visby = await authService.getVisby(session.user.id);
          if (profile) setUser(profile);
          if (visby) setVisby(visby);

          try {
            const [userStamps, userBites] = await Promise.all([
              stampsService.getUserStamps(session.user.id),
              bitesService.getUserBites(session.user.id),
            ]);
            setStamps(userStamps);
            setBites(userBites);
          } catch (e) {
            console.error('Error loading collections:', e);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading screen while fonts are loading
  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <RNText style={styles.loadingEmoji}>✨</RNText>
        <RNText style={styles.loadingText}>Visby</RNText>
        <RNText style={styles.loadingSubtext}>Loading adventure...</RNText>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.base.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary.wisteriaDark,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: colors.text.secondary,
  },
});
