import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getShadowStyle } from '../../theme/shadows';
import { Icon, IconName } from '../ui/Icon';
import { hapticService } from '../../services/haptics';
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import type { RootStackParamList, MainTabParamList } from '../../types';

type TabName = keyof MainTabParamList;

interface TabDef {
  name: TabName;
  label: string;
  iconFilled: IconName;
  iconOutline: IconName;
}

const TABS: TabDef[] = [
  { name: 'Home', label: 'Home', iconFilled: 'homeFilled', iconOutline: 'homeOutline' },
  { name: 'Explore', label: 'Explore', iconFilled: 'compass', iconOutline: 'compassOutline' },
  { name: 'Inbox', label: 'Inbox', iconFilled: 'mail', iconOutline: 'mailOutline' },
  { name: 'Profile', label: 'Profile', iconFilled: 'person', iconOutline: 'personOutline' },
];

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
      <View style={tabStyles.iconWrap}>
        {focused && <View style={tabStyles.focusGlow} />}
        <Animated.View style={iconStyle}>
          <Icon
            name={focused ? iconName : iconNameOutline}
            size={24}
            color={focused ? colors.primary.wisteriaDark : colors.text.muted}
          />
        </Animated.View>
        <Animated.View style={[tabStyles.focusIndicator, indicatorStyle]} />
      </View>
    );
  },
);

const tabStyles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center', justifyContent: 'center',
    padding: spacing.xxs, position: 'relative',
  },
  focusGlow: {
    position: 'absolute', width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(184, 165, 224, 0.12)', top: -6,
  },
  focusIndicator: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: colors.primary.wisteriaDark, marginTop: 4,
    ...getShadowStyle({
      shadowColor: colors.primary.wisteria,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 6,
    }),
  },
});

interface PersistentBottomNavProps {
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>;
  activeTab: TabName;
}

export const PersistentBottomNav = React.memo<PersistentBottomNavProps>(
  ({ navigationRef, activeTab }) => {
    const insets = useSafeAreaInsets();
    const bottomPadding = Math.max(insets.bottom, 8);

    const handlePress = useCallback(
      (tab: TabName) => {
        hapticService.selection();
        navigationRef.navigate('Main', { screen: tab } as any);
      },
      [navigationRef],
    );

    return (
      <View style={[styles.container, { paddingBottom: bottomPadding }]}>
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={60}
            tint="systemChromeMaterialLight"
            style={[StyleSheet.absoluteFill, styles.bgRadius, { pointerEvents: 'none' }]}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidBg, { pointerEvents: 'none' }]} />
        )}
        <View style={styles.tabRow}>
          {TABS.map((tab) => {
            const focused = activeTab === tab.name;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabButton}
                onPress={() => handlePress(tab.name)}
                accessibilityRole="tab"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: focused }}
                activeOpacity={0.7}
              >
                <TabIcon
                  focused={focused}
                  iconName={tab.iconFilled}
                  iconNameOutline={tab.iconOutline}
                />
                <Animated.Text
                  style={[
                    styles.label,
                    { color: focused ? colors.primary.wisteriaDark : colors.text.muted },
                  ]}
                >
                  {tab.label}
                </Animated.Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(253, 251, 248, 0.92)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing.sm,
    ...getShadowStyle({
      shadowColor: 'rgba(184, 165, 224, 0.2)',
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 1,
      shadowRadius: 24,
    }),
    elevation: 16,
    overflow: 'hidden',
  },
  bgRadius: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  androidBg: {
    backgroundColor: 'rgba(253, 251, 248, 0.95)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.3,
  },
});
