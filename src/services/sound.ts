/**
 * Optional sound effects for game actions.
 * Respects settings.soundEffects; no-op when muted or when expo-audio fails to load.
 */
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useStore } from '../store/useStore';

const SOUNDS = {
  success: 'https://assets.mixkit.co/active_storage/sfx/2560-success.mp3',
  tap: 'https://assets.mixkit.co/active_storage/sfx/2570-hit.mp3',
} as const;

let audioModeSet = false;

async function ensureAudioMode() {
  if (audioModeSet) return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
    });
    audioModeSet = true;
  } catch {
    // ignore
  }
}

async function playUrl(uri: string): Promise<void> {
  try {
    await ensureAudioMode();
    const player = createAudioPlayer(uri);
    player.play();
    setTimeout(() => {
      try {
        player.release();
      } catch {
        // ignore
      }
    }, 2000);
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
