/**
 * Audio service for background music, ambient sounds, and text-to-speech pronunciation.
 * Per-country ambient tracks, Visby voice lines, and language learning audio.
 */

import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useStore } from '../store/useStore';

let audioModeSet = false;

async function ensureAudioMode() {
  if (audioModeSet) return;
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
    audioModeSet = true;
  } catch {
    // ignore
  }
}

// ─── AMBIENT SOUND DEFINITIONS ───

interface AmbientTrack {
  countryId: string;
  name: string;
  url: string;
}

const AMBIENT_TRACKS: AmbientTrack[] = [
  { countryId: 'jp', name: 'Japanese Garden', url: 'https://assets.mixkit.co/active_storage/sfx/212-japanese-garden.mp3' },
  { countryId: 'fr', name: 'Paris Cafe', url: 'https://assets.mixkit.co/active_storage/sfx/213-cafe-ambience.mp3' },
  { countryId: 'mx', name: 'Mexican Fiesta', url: 'https://assets.mixkit.co/active_storage/sfx/214-fiesta.mp3' },
  { countryId: 'it', name: 'Italian Piazza', url: 'https://assets.mixkit.co/active_storage/sfx/215-piazza.mp3' },
  { countryId: 'gb', name: 'London Rain', url: 'https://assets.mixkit.co/active_storage/sfx/216-rain.mp3' },
  { countryId: 'br', name: 'Brazilian Beach', url: 'https://assets.mixkit.co/active_storage/sfx/217-beach.mp3' },
];

const ROOM_AMBIENT_MAP: Record<string, Record<string, { description: string; volume: number }>> = {
  jp: {
    living: { description: 'Japanese garden - water and birds', volume: 0.15 },
    kitchen: { description: 'Kitchen sounds - sizzling and chopsticks', volume: 0.12 },
    garden: { description: 'Zen garden - wind chimes and water', volume: 0.18 },
    study: { description: 'Paper sliding and soft wind', volume: 0.1 },
  },
  fr: {
    living: { description: 'Parisian cafe - soft chatter and clinking', volume: 0.15 },
    kitchen: { description: 'French kitchen - simmering and chopping', volume: 0.12 },
    garden: { description: 'French garden - birds and fountain', volume: 0.18 },
    study: { description: 'Library quiet - pages turning', volume: 0.1 },
  },
  no: {
    living: { description: 'Crackling fire and distant wind', volume: 0.18 },
    kitchen: { description: 'Hearty cooking and wooden utensils', volume: 0.12 },
    garden: { description: 'Northern wind and aurora hum', volume: 0.15 },
    study: { description: 'Viking tales - soft drumming', volume: 0.1 },
  },
};

export function getAmbientForRoom(countryId: string, roomId: string): string {
  const countryRooms = ROOM_AMBIENT_MAP[countryId];
  if (countryRooms?.[roomId]) {
    return countryRooms[roomId].description;
  }
  const track = AMBIENT_TRACKS.find((t) => t.countryId === countryId);
  return track?.name ?? '';
}

const BACKGROUND_MUSIC_URL = 'https://assets.mixkit.co/active_storage/sfx/2515-game-music.mp3';

let currentAmbientPlayer: any = null;
let currentMusicPlayer: any = null;

function isSoundEnabled(): boolean {
  const settings = useStore.getState().settings as { soundEffects?: boolean };
  return settings.soundEffects !== false;
}

function isAmbientEnabled(): boolean {
  const settings = useStore.getState().settings as { ambientSound?: boolean };
  return settings.ambientSound === true;
}

// ─── AMBIENT SOUNDS ───

export const audioService = {
  async playAmbientForCountry(countryId: string): Promise<void> {
    if (!isAmbientEnabled()) return;
    await this.stopAmbient();

    const track = AMBIENT_TRACKS.find((t) => t.countryId === countryId);
    if (!track) return;

    try {
      await ensureAudioMode();
      currentAmbientPlayer = createAudioPlayer(track.url);
      currentAmbientPlayer.loop = true;
      currentAmbientPlayer.volume = 0.3;
      currentAmbientPlayer.play();
    } catch {
      // ignore
    }
  },

  async stopAmbient(): Promise<void> {
    if (currentAmbientPlayer) {
      try {
        currentAmbientPlayer.release();
      } catch {
        // ignore
      }
      currentAmbientPlayer = null;
    }
  },

  async playBackgroundMusic(): Promise<void> {
    if (!isSoundEnabled()) return;
    await this.stopMusic();

    try {
      await ensureAudioMode();
      currentMusicPlayer = createAudioPlayer(BACKGROUND_MUSIC_URL);
      currentMusicPlayer.loop = true;
      currentMusicPlayer.volume = 0.15;
      currentMusicPlayer.play();
    } catch {
      // ignore
    }
  },

  async stopMusic(): Promise<void> {
    if (currentMusicPlayer) {
      try {
        currentMusicPlayer.release();
      } catch {
        // ignore
      }
      currentMusicPlayer = null;
    }
  },

  stopAll(): void {
    this.stopAmbient();
    this.stopMusic();
  },

  getAmbientTrackName(countryId: string): string | null {
    return AMBIENT_TRACKS.find((t) => t.countryId === countryId)?.name || null;
  },
};

// ─── TEXT-TO-SPEECH FOR LANGUAGE LEARNING ───

const LANGUAGE_CODES: Record<string, string> = {
  jp: 'ja-JP',
  fr: 'fr-FR',
  mx: 'es-MX',
  it: 'it-IT',
  gb: 'en-GB',
  br: 'pt-BR',
  kr: 'ko-KR',
  th: 'th-TH',
  ma: 'ar-MA',
  pe: 'es-PE',
  ke: 'sw-KE',
  no: 'nb-NO',
  tr: 'tr-TR',
  gr: 'el-GR',
  de: 'de-DE',
  cn: 'zh-CN',
  in: 'hi-IN',
  vn: 'vi-VN',
};

export const speechService = {
  speak(text: string, countryId?: string): void {
    if (!isSoundEnabled()) return;
    const language = countryId ? LANGUAGE_CODES[countryId] : undefined;
    Speech.speak(text, {
      language: language || 'en-US',
      rate: 0.85,
      pitch: 1.1,
    });
  },

  speakWord(word: string, language: string): void {
    if (!isSoundEnabled()) return;
    Speech.speak(word, {
      language,
      rate: 0.75,
      pitch: 1.0,
    });
  },

  stop(): void {
    Speech.stop();
  },

  async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      return await Speech.getAvailableVoicesAsync();
    } catch {
      return [];
    }
  },

  getLanguageCode(countryId: string): string | undefined {
    return LANGUAGE_CODES[countryId];
  },
};
