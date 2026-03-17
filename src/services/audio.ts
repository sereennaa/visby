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

// Ambient sound is now managed by ambientSoundService (src/services/ambientSound.ts).
// This module retains background music and TTS only.

const BACKGROUND_MUSIC_URL = 'https://assets.mixkit.co/active_storage/sfx/2515-game-music.mp3';

let currentMusicPlayer: any = null;

function isSoundEnabled(): boolean {
  const settings = useStore.getState().settings as { soundEffects?: boolean };
  return settings.soundEffects !== false;
}

export const audioService = {
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
    this.stopMusic();
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

export const LANGUAGE_NAME_TO_CODE: Record<string, string> = {
  French: 'fr-FR',
  Japanese: 'ja-JP',
  Spanish: 'es-MX',
  German: 'de-DE',
  Italian: 'it-IT',
  Hindi: 'hi-IN',
  Korean: 'ko-KR',
  Thai: 'th-TH',
  Portuguese: 'pt-BR',
  Arabic: 'ar-MA',
  Chinese: 'zh-CN',
  Norwegian: 'nb-NO',
  Turkish: 'tr-TR',
  Greek: 'el-GR',
  Vietnamese: 'vi-VN',
  Swahili: 'sw-KE',
};

function isReadAloudEnabled(): boolean {
  const settings = useStore.getState().settings as { readAloud?: boolean };
  return settings.readAloud !== false;
}

export const speechService = {
  speak(text: string, countryId?: string, onDone?: () => void): void {
    if (!isSoundEnabled() || !isReadAloudEnabled()) {
      onDone?.();
      return;
    }
    Speech.stop();
    const language = countryId ? LANGUAGE_CODES[countryId] : undefined;
    Speech.speak(text, {
      language: language || 'en-US',
      rate: 0.85,
      pitch: 1.1,
      onDone: () => onDone?.(),
      onStopped: () => onDone?.(),
      onError: () => onDone?.(),
    });
  },

  speakWord(word: string, language: string, onDone?: () => void): void {
    if (!isSoundEnabled() || !isReadAloudEnabled()) {
      onDone?.();
      return;
    }
    Speech.stop();
    Speech.speak(word, {
      language,
      rate: 0.75,
      pitch: 1.0,
      onDone: () => onDone?.(),
      onStopped: () => onDone?.(),
      onError: () => onDone?.(),
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

  hasLanguageCode(countryId: string): boolean {
    return countryId in LANGUAGE_CODES;
  },

  isReadAloudEnabled,
};
