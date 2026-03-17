/**
 * Optional sound effects for game actions.
 * Respects settings.soundEffects; no-op when muted or when expo-audio fails to load.
 */
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Platform } from 'react-native';
import { useStore } from '../store/useStore';

const SOUNDS = {
  success: 'https://assets.mixkit.co/active_storage/sfx/2560-success.mp3',
  tap: 'https://assets.mixkit.co/active_storage/sfx/2570-hit.mp3',
  celebration: 'https://assets.mixkit.co/active_storage/sfx/2020-game-bonus.mp3',
  pop: 'https://assets.mixkit.co/active_storage/sfx/2357-pop.mp3',
  chime: 'https://assets.mixkit.co/active_storage/sfx/2309-notification.mp3',
  whoosh: 'https://assets.mixkit.co/active_storage/sfx/2514-whoosh.mp3',
  streak: 'https://assets.mixkit.co/active_storage/sfx/2019-achievement.mp3',
  collect: 'https://assets.mixkit.co/active_storage/sfx/2013-bonus.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2955-wrong.mp3',
  levelUp: 'https://assets.mixkit.co/active_storage/sfx/1997-achievement.mp3',
  navigate: 'https://assets.mixkit.co/active_storage/sfx/2568-click.mp3',
  reveal: 'https://assets.mixkit.co/active_storage/sfx/2018-magical.mp3',
  countdown: 'https://assets.mixkit.co/active_storage/sfx/2571-tick.mp3',
  auraGain: 'https://assets.mixkit.co/active_storage/sfx/2003-coin.mp3',
  unwrap: 'https://assets.mixkit.co/active_storage/sfx/2016-unlock.mp3',
  stamp: 'https://assets.mixkit.co/active_storage/sfx/2572-stamp.mp3',
  arrival: 'https://assets.mixkit.co/active_storage/sfx/2017-magic-reveal.mp3',
} as const;

let audioModeSet = false;
let webAudioFailed = false;

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

function playUrlWeb(uri: string): void {
  try {
    const audio = new Audio(uri);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {
    // Web audio not available
  }
}

async function playUrl(uri: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (!webAudioFailed) playUrlWeb(uri);
    return;
  }
  try {
    await ensureAudioMode();
    const player = createAudioPlayer(uri);
    if (!player) return;
    const playResult = player.play();
    if (playResult && typeof (playResult as Promise<void>).catch === 'function') {
      (playResult as Promise<void>).catch(() => {});
    }
    setTimeout(() => {
      try { player.release(); } catch { /* noop */ }
    }, 2000);
  } catch {
    // silently ignore audio failures
  }
}

function isSoundEnabled(): boolean {
  const settings = useStore.getState().settings as { soundEffects?: boolean };
  return settings.soundEffects !== false;
}

function playStub(name: string, fallbackUrl?: string): void {
  if (__DEV__) {
    console.log(`[sound] ${name}`);
  }
  if (fallbackUrl && isSoundEnabled()) {
    playUrl(fallbackUrl);
  }
}

export const soundService = {
  playMatch() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.success);
  },
  playStampCollected() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.pop);
  },
  playMissionComplete() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.celebration);
  },
  playLevelUp() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.celebration);
  },
  playBadgeEarned() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.pop);
  },
  playChapterUnlocked() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.chime);
  },
  playStreakMilestone() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.streak);
  },
  playChime() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.chime);
  },
  playWhoosh() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.whoosh);
  },
  playVisbyHappy() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.chime);
  },
  playVisbyHungry() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.tap);
  },
  playVisbySleepy() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.tap);
  },
  playTap() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.tap);
  },
  playCollect() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.collect);
  },
  playError() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.error);
  },
  playNavigate() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.navigate);
  },
  playReveal() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.reveal);
  },
  playCountdown() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.countdown);
  },
  playAuraGain() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.auraGain);
  },
  playUnwrap() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.unwrap);
  },
  playStamp() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.stamp);
  },
  playArrival() {
    if (!isSoundEnabled()) return;
    playUrl(SOUNDS.arrival);
  },
};
