import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getShadowStyle } from '../../theme/shadows';
import { Text, Heading, Caption } from './Text';
import { Button } from './Button';
import { Icon } from './Icon';
import { useStore } from '../../store/useStore';

const CHECK_INTERVAL_MS = 30 * 1000; // check every 30 seconds

export const SessionRestOverlay: React.FC = () => {
  const settings = useStore(s => s.settings);
  const sessionStartedAt = useStore(s => s.sessionStartedAt);
  const setSessionStartedNow = useStore(s => s.setSessionStartedNow);
  const [show, setShow] = useState(false);

  const sessionTimerMinutes = (settings as { sessionTimerMinutes?: number }).sessionTimerMinutes ?? 0;

  useEffect(() => {
    if (sessionTimerMinutes <= 0) return;

    const check = () => {
      const started = sessionStartedAt ?? Date.now();
      const elapsed = Date.now() - started;
      const limitMs = sessionTimerMinutes * 60 * 1000;
      if (elapsed >= limitMs) setShow(true);
    };

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [sessionTimerMinutes, sessionStartedAt]);

  useEffect(() => {
    if (sessionTimerMinutes > 0 && sessionStartedAt === null) {
      setSessionStartedNow();
    }
  }, [sessionTimerMinutes, sessionStartedAt, setSessionStartedNow]);

  const dismiss = () => {
    setSessionStartedNow();
    setShow(false);
  };

  if (!show) return null;

  return (
    <Modal visible={show} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.card}>
          <LinearGradient colors={[colors.primary.wisteriaFaded, colors.calm.skyLight]} style={s.iconCircle}>
            <Icon name="sparkles" size={48} color={colors.primary.wisteriaDark} />
          </LinearGradient>
          <Heading level={1} style={s.title}>Visby is resting</Heading>
          <Text style={s.desc}>Take a short break! Your progress is saved.</Text>
          <Caption style={s.sub}>Come back whenever you&apos;re ready to explore again.</Caption>
          <Button title="Start new session" onPress={dismiss} variant="primary" style={s.btn} />
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.xxl,
    maxWidth: 320,
    width: '85%',
    alignItems: 'center',
    padding: 32,
    elevation: 12,
    ...getShadowStyle({ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 24 }),
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  desc: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
  sub: {
    textAlign: 'center',
    marginTop: spacing.xs,
    color: colors.text.muted,
  },
  btn: {
    marginTop: spacing.xl,
  },
});

export default SessionRestOverlay;
