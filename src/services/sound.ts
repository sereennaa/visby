/**
 * Optional sound effects for game actions.
 * Respects settings.soundEffects; no-op when muted or when expo-av fails to load.
 */
import { Audio } from 'expo-av';
import { useStore } from '../store/useStore';

const SOUNDS = {
  success: 'https://assets.mixkit.co/active_storage/sfx/2560-success.mp3',
  tap: 'https://assets.mixkit.co/active_storage/sfx/2570-hit.mp3',
} as const;

let audioModeSet = false;

async function ensureAudioMode() {
  if (audioModeSet) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    audioModeSet = true;
  } catch {
    // ignore
  }
}

async function playUrl(uri: string): Promise<void> {
  try {
    await ensureAudioMode();
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    setTimeout(() => sound.unloadAsync().catch(() => {}), 2000);
  } catch {
    // ignore (network, unsupported, etc.)
  }
}

function isSoundEnabled(): boolean {
  const settings = useStore.getState().settings as { soundEffects?: boolean };
  return settings.soundEffects !== false;
}

export const soundService = {
  playMatch() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.success);
  },
  playStampCollected() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.success);
  },
  playMissionComplete() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.success);
  },
  playLevelUp() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.success);
  },
  playTap() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.tap);
  },
};
