/**
 * Ambient sound service for country rooms.
 * Plays background audio per-country with fade-in/out on room enter/exit.
 * Respects settings.ambientSound and settings.soundEffects.
 */
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';
import { useStore } from '../store/useStore';

const AMBIENT_URLS: Record<string, Record<string, string>> = {
  jp: {
    default: 'https://assets.mixkit.co/active_storage/sfx/212-japanese-garden.mp3',
    kitchen: 'https://assets.mixkit.co/active_storage/sfx/213-cooking-ambiance.mp3',
    garden: 'https://assets.mixkit.co/active_storage/sfx/212-japanese-garden.mp3',
  },
  fr: {
    default: 'https://assets.mixkit.co/active_storage/sfx/214-paris-cafe.mp3',
    kitchen: 'https://assets.mixkit.co/active_storage/sfx/213-cooking-ambiance.mp3',
  },
  mx: {
    default: 'https://assets.mixkit.co/active_storage/sfx/215-mexican-fiesta.mp3',
  },
  it: {
    default: 'https://assets.mixkit.co/active_storage/sfx/216-italian-piazza.mp3',
    kitchen: 'https://assets.mixkit.co/active_storage/sfx/213-cooking-ambiance.mp3',
  },
  gb: {
    default: 'https://assets.mixkit.co/active_storage/sfx/217-london-rain.mp3',
  },
  br: {
    default: 'https://assets.mixkit.co/active_storage/sfx/218-brazilian-beach.mp3',
  },
};

const GENERIC_AMBIENT = 'https://assets.mixkit.co/active_storage/sfx/212-japanese-garden.mp3';

let currentPlayer: AudioPlayer | null = null;
let currentKey: string = '';
let fadeInterval: ReturnType<typeof setInterval> | null = null;

function isEnabled(): boolean {
  const s = useStore.getState().settings;
  return s.ambientSound !== false && s.soundEffects !== false;
}

function getUrl(countryId: string, roomId?: string): string {
  const country = AMBIENT_URLS[countryId];
  if (!country) return GENERIC_AMBIENT;
  if (roomId && country[roomId]) return country[roomId];
  return country.default || GENERIC_AMBIENT;
}

async function fadeOut(duration = 1000): Promise<void> {
  if (!currentPlayer) return;
  const player = currentPlayer;
  const steps = 10;
  const stepDur = duration / steps;
  let vol = 1;

  return new Promise((resolve) => {
    fadeInterval = setInterval(() => {
      vol -= 1 / steps;
      if (vol <= 0) {
        if (fadeInterval) clearInterval(fadeInterval);
        fadeInterval = null;
        try {
          player.pause();
          player.release();
        } catch {}
        if (currentPlayer === player) currentPlayer = null;
        resolve();
        return;
      }
      try { player.volume = Math.max(0, vol); } catch {}
    }, stepDur);
  });
}

export const ambientSoundService = {
  async enterRoom(countryId: string, roomId?: string): Promise<void> {
    if (!isEnabled()) return;

    const key = `${countryId}_${roomId || 'default'}`;
    if (key === currentKey && currentPlayer) return;

    await this.leaveRoom();
    currentKey = key;

    try {
      const url = getUrl(countryId, roomId);

      if (Platform.OS === 'web') {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0;
        const webPlayer = {
          _audio: audio,
          get volume() { return audio.volume; },
          set volume(v: number) { audio.volume = v; },
          loop: true,
          play() { audio.play().catch(() => {}); },
          pause() { audio.pause(); },
          release() { audio.pause(); audio.src = ''; },
        } as unknown as AudioPlayer;
        currentPlayer = webPlayer;
        audio.play().catch(() => {});

        let vol = 0;
        const steps = 10;
        const stepDur = 1000 / steps;
        const fadeIn = setInterval(() => {
          vol += 1 / steps;
          if (vol >= 0.4) {
            clearInterval(fadeIn);
            try { if (currentPlayer === webPlayer) audio.volume = 0.4; } catch {}
            return;
          }
          try { if (currentPlayer === webPlayer) audio.volume = vol; } catch {}
        }, stepDur);
      } else {
        await setAudioModeAsync({ playsInSilentMode: true });
        const player = createAudioPlayer(url);
        if (!player) return;

        player.volume = 0;
        player.loop = true;
        currentPlayer = player;

        try {
          player.play();
        } catch {}

        let vol = 0;
        const steps = 10;
        const stepDur = 1000 / steps;
        const fadeIn = setInterval(() => {
          vol += 1 / steps;
          if (vol >= 0.4) {
            clearInterval(fadeIn);
            try { if (currentPlayer === player) player.volume = 0.4; } catch {}
            return;
          }
          try { if (currentPlayer === player) player.volume = vol; } catch {}
        }, stepDur);
      }
    } catch (err) {
      if (__DEV__) console.log('[ambient] enterRoom failed:', err);
    }
  },

  async leaveRoom(): Promise<void> {
    currentKey = '';
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }
    if (currentPlayer) {
      await fadeOut(800);
    }
  },

  setVolume(vol: number): void {
    if (currentPlayer) {
      try { currentPlayer.volume = Math.max(0, Math.min(1, vol)); } catch {}
    }
  },

  isPlaying(): boolean {
    return currentPlayer !== null;
  },
};
