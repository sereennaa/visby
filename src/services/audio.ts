/**
 * Audio service for background music, ambient sounds, and text-to-speech pronunciation.
 * Per-country ambient tracks, Visby voice lines, and language learning audio.
 */

import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import type { Voice } from 'expo-speech';
import { VoiceQuality } from 'expo-speech';
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
      if (Platform.OS === 'web') {
        const audio = new Audio(BACKGROUND_MUSIC_URL);
        audio.loop = true;
        audio.volume = 0.15;
        audio.play().catch(() => {});
        currentMusicPlayer = { release: () => { audio.pause(); audio.src = ''; } };
      } else {
        await ensureAudioMode();
        currentMusicPlayer = createAudioPlayer(BACKGROUND_MUSIC_URL);
        currentMusicPlayer.loop = true;
        currentMusicPlayer.volume = 0.15;
        currentMusicPlayer.play();
      }
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

// Languages that sound best with system default voice only (no custom voice id).
// Custom voice selection can break Japanese/Korean/Chinese on some devices.
const USE_SYSTEM_DEFAULT_VOICE_ONLY = new Set(['ja-JP', 'ja', 'ko-KR', 'ko', 'zh-CN', 'zh-TW', 'zh']);

// Best voice per language (Enhanced > Default), populated lazily.
let voiceCache: Map<string, string> | null = null;

function pickBestVoiceForLanguage(voices: Voice[], language: string): string | undefined {
  const lang = language.toLowerCase();
  const langBase = lang.split('-')[0];
  const forLang = voices.filter(
    (v) => v.language.toLowerCase() === lang || v.language.toLowerCase().startsWith(langBase)
  );
  if (forLang.length === 0) return undefined;
  // Prefer exact language match (e.g. ja-JP over generic ja)
  const exact = forLang.find((v) => v.language.toLowerCase() === lang);
  const pool = exact ? forLang.filter((v) => v.language.toLowerCase() === lang) : forLang;
  const enhanced = pool.find((v) => v.quality === VoiceQuality.Enhanced);
  if (enhanced) return enhanced.identifier;
  return pool[0].identifier;
}

async function getVoiceForLanguage(language: string): Promise<string | undefined> {
  if (USE_SYSTEM_DEFAULT_VOICE_ONLY.has(language)) return undefined;
  if (voiceCache?.has(language)) return voiceCache.get(language);
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    if (!voiceCache) voiceCache = new Map();
    const identifier = pickBestVoiceForLanguage(voices, language);
    if (identifier) voiceCache.set(language, identifier);
    return identifier;
  } catch {
    return undefined;
  }
}

export const speechService = {
  speak(text: string, countryId?: string, onDone?: () => void): void {
    if (!isSoundEnabled() || !isReadAloudEnabled()) {
      onDone?.();
      return;
    }
    Speech.stop();
    const language = countryId ? LANGUAGE_CODES[countryId] : 'en-US';
    const lang = language || 'en-US';
    getVoiceForLanguage(lang).then((voice) => {
      Speech.speak(text, {
        language: lang,
        rate: 0.85,
        pitch: 1.1,
        ...(voice && { voice }),
        onDone: () => onDone?.(),
        onStopped: () => onDone?.(),
        onError: () => onDone?.(),
      });
    });
  },

  speakWord(word: string, language: string, onDone?: () => void): void {
    if (!isSoundEnabled() || !isReadAloudEnabled()) {
      onDone?.();
      return;
    }
    Speech.stop();
    getVoiceForLanguage(language).then((voice) => {
      Speech.speak(word, {
        language,
        rate: 0.75,
        pitch: 1.0,
        ...(voice && { voice }),
        onDone: () => onDone?.(),
        onStopped: () => onDone?.(),
        onError: () => onDone?.(),
      });
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
