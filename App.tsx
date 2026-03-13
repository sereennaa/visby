import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useStore } from './src/store/useStore';
import { supabase, isSupabaseConfigured } from './src/config/supabase';
import { authService } from './src/services/auth';
import { colors } from './src/theme/colors';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { setUser, setVisby, setLoading, isLoading } = useStore();

  // Load custom fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Quicksand-Regular': Quicksand_400Regular,
          'Quicksand-Medium': Quicksand_500Medium,
          'Quicksand-SemiBold': Quicksand_600SemiBold,
          'Quicksand-Bold': Quicksand_700Bold,
          'Fredoka-Regular': Fredoka_400Regular,
          'Fredoka-Medium': Fredoka_500Medium,
          'Fredoka-SemiBold': Fredoka_600SemiBold,
          'Fredoka-Bold': Fredoka_700Bold,
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
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();

    // Skip auth listener if Supabase isn't configured
    if (!isSupabaseConfigured) {
      return;
    }

    // Listen for auth state changes
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
