import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, TouchableOpacity, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  cancelAnimation,
  Easing,
  interpolate,
  FadeIn,
} from 'react-native-reanimated';
import * as Font from 'expo-font';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from '@expo/vector-icons';
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
import { Icon } from './src/components/ui/Icon';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ProgressionOverlay } from './src/components/ui/ProgressionOverlay';
import { SessionRestOverlay } from './src/components/ui/SessionRestOverlay';
import { ToastContainer } from './src/components/ui/Toast';
import { useStore } from './src/store/useStore';
import { supabase, isSupabaseConfigured } from './src/config/supabase';
import { authService } from './src/services/auth';
import { setupNotifications } from './src/services/notifications';
import { getActiveEvent } from './src/config/seasonalEvents';
import { stampsService } from './src/services/stamps';
import { bitesService } from './src/services/bites';
import { useWidgetSync } from './src/hooks/useWidgetSync';
import { colors } from './src/theme/colors';
import { analyticsService } from './src/services/analytics';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    try {
      analyticsService.logError('app_crash', {
        message: error.message,
        stack: error.stack?.slice(0, 500),
        componentStack: errorInfo.componentStack?.slice(0, 500),
      });
    } catch (_) {}
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: colors.base.cream }}>
          <Icon name="warning" size={48} color={colors.primary.wisteria} />
          <Text style={{ fontFamily: 'Baloo2-Bold', fontSize: 22, color: colors.text.primary, textAlign: 'center', marginBottom: 8 }}>
            Oops! Something went wrong
          </Text>
          <Text style={{ fontFamily: 'Nunito-Medium', fontSize: 15, color: colors.text.secondary, textAlign: 'center', marginBottom: 24 }}>
            Don't worry, your progress is saved. Try restarting the app.
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false, error: null })}
            style={{ backgroundColor: '#B8A5E0', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Must be first: same hook order every render (no early return before this)
  useWidgetSync();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { setUser, setVisby, setStamps, setBites, setLoading, isLoading } = useStore();

  // Load custom fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        const iconFonts = [Ionicons, MaterialCommunityIcons, Feather, FontAwesome5, MaterialIcons];
        const iconFontMap = Object.assign({}, ...iconFonts.map(f => (f as any).font));
        await Font.loadAsync({
          ...iconFontMap,
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
        if (__DEV__) console.error('Error loading fonts:', error);
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
            if (__DEV__) console.error('Error loading collections:', e);
          }
        }
      } catch (error) {
        if (__DEV__) console.error('Session check error:', error);
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
            if (__DEV__) console.error('Error loading collections:', e);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Session tracking: log session length when app goes to background
  const sessionStartTimeRef = useRef<number>(Date.now());
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background') {
        const durationSeconds = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
        if (durationSeconds > 0) analyticsService.trackSessionLength(durationSeconds);
      } else if (nextState === 'active') {
        sessionStartTimeRef.current = Date.now();
      }
    });
    return () => sub.remove();
  }, []);

  // Schedule local notifications when app is ready (respects settings.notifications)
  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      const state = useStore.getState();
      const settings = state.settings as { notifications?: boolean; reminderTime?: string };
      const enabled = settings.notifications !== false;
      const activeEvent = getActiveEvent();
      const nextChapter = state.getNextChapterToShow?.();
      const dueFlashcards = state.getDueFlashcards?.() ?? [];
      setupNotifications({
        notificationsEnabled: enabled,
        reminderTime: settings.reminderTime ?? '19:00',
        streakDays: state.user?.currentStreak ?? 0,
        visbyMood: state.getVisbyMood?.(),
        dueFlashcards: dueFlashcards.length,
        nextChapterTitle: nextChapter?.title,
        activeEventName: activeEvent?.name,
        activeEventEndDate: activeEvent?.endDate,
      }).catch(() => {});
      const uid = state.user?.id;
      if (uid && /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(uid)) {
        state.syncFriends?.().catch(() => {});
      }
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return <BrandedLoading />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <ErrorBoundary>
          <AppNavigator />
          <ProgressionOverlay />
          <SessionRestOverlay />
          <ToastContainer />
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const BrandedLoading = () => {
  const wobble = useSharedValue(0);
  const glowPulse = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    wobble.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        withTiming(-1, { duration: 600, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
      ),
      -1, true,
    );
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        withTiming(0, { duration: 1200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
      ),
      -1, true,
    );
    textOpacity.value = withTiming(1, { duration: 800 });
    return () => {
      cancelAnimation(wobble);
      cancelAnimation(glowPulse);
    };
  }, []);

  const wobbleStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(wobble.value, [-1, 1], [-3, 3])}deg` },
      { translateY: interpolate(wobble.value, [-1, 0, 1], [2, -2, 2]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.1, 0.3]),
    transform: [{ scale: interpolate(glowPulse.value, [0, 1], [0.8, 1.2]) }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingLogoContainer}>
        <Animated.View style={[styles.loadingGlow, glowStyle]} />
        <Animated.View style={wobbleStyle}>
          <Text style={styles.loadingEgg}>{'\u{1F95A}'}</Text>
        </Animated.View>
        <Text style={styles.loadingText}>Visby</Text>
      </View>
      <Animated.View style={textStyle}>
        <Text style={styles.loadingSubtext}>Loading adventure...</Text>
      </Animated.View>
      <View style={styles.loadingParticles}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={[styles.loadingDot, {
            left: `${15 + i * 14}%`,
            opacity: 0.15 + i * 0.05,
          } as any]} />
        ))}
      </View>
    </View>
  );
};

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
  loadingLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  loadingGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(184, 165, 224, 0.2)',
  },
  loadingEgg: {
    fontSize: 56,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: colors.primary.wisteriaDark,
    letterSpacing: -1,
  },
  loadingSubtext: {
    fontSize: 15,
    color: colors.text.muted,
    letterSpacing: 0.5,
  },
  loadingParticles: {
    position: 'absolute',
    bottom: '20%',
    left: 0,
    right: 0,
    height: 40,
  },
  loadingDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary.wisteriaLight,
  },
});
