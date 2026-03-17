/**
 * Visby chat TTS: natural voice via OpenAI TTS API (shimmer), with expo-speech fallback.
 */

import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { File, Directory, Paths } from 'expo-file-system';

const OPENAI_TTS_URL = 'https://api.openai.com/v1/audio/speech';
const API_KEY = process.env.EXPO_PUBLIC_AI_CHAT_KEY || '';
const TTS_CACHE_DIR = 'visby_tts';
const MAX_CACHE_ENTRIES = 50;

let speaking = false;
let doneCallback: (() => void) | null = null;
let currentPlayer: ReturnType<typeof createAudioPlayer> | null = null;
const cache = new Map<string, string>();
let cacheOrder: string[] = [];

const FALLBACK_CONFIG: Speech.SpeechOptions = {
  language: 'en-US',
  rate: Platform.OS === 'ios' ? 0.92 : 0.88,
  pitch: 1.15,
};

function stripEmoji(text: string): string {
  return text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, '').trim();
}

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h;
  }
  return Math.abs(h).toString(36);
}

let audioModeSet = false;
async function ensureAudioMode(): Promise<void> {
  if (audioModeSet) return;
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
    audioModeSet = true;
  } catch {
    // ignore
  }
}

function pruneCache(): void {
  if (cacheOrder.length <= MAX_CACHE_ENTRIES) return;
  const toRemove = cacheOrder.splice(0, cacheOrder.length - MAX_CACHE_ENTRIES);
  for (const hash of toRemove) {
    const uri = cache.get(hash);
    cache.delete(hash);
    if (uri) {
      try {
        const f = new File(uri);
        if (f.exists) f.delete();
      } catch {
        // ignore
      }
    }
  }
}

function finishSpeaking(): void {
  speaking = false;
  const cb = doneCallback;
  doneCallback = null;
  if (currentPlayer) {
    try {
      (currentPlayer as { remove?: () => void }).remove?.();
    } catch {
      // ignore
    }
    currentPlayer = null;
  }
  cb?.();
}

function fallbackSpeak(clean: string): void {
  Speech.speak(clean, {
    ...FALLBACK_CONFIG,
    onDone: finishSpeaking,
    onStopped: () => {
      speaking = false;
      doneCallback = null;
    },
    onError: finishSpeaking,
  });
}

async function fetchAndPlayOpenAITTS(clean: string): Promise<void> {
  if (!API_KEY) {
    fallbackSpeak(clean);
    return;
  }

  const hash = simpleHash(clean);
  const dir = new Directory(Paths.cache, TTS_CACHE_DIR);

  try {
    await ensureAudioMode();
  } catch {
    fallbackSpeak(clean);
    return;
  }

  let fileUri: string;

  if (cache.has(hash)) {
    fileUri = cache.get(hash)!;
    const existing = new File(fileUri);
    if (existing.exists) {
      cacheOrder = cacheOrder.filter((k) => k !== hash);
      cacheOrder.push(hash);
      try {
        const player = createAudioPlayer(fileUri);
        if (!player) {
          fallbackSpeak(clean);
          return;
        }
        currentPlayer = player;
        (player as { addListener?(event: string, cb: (s: { didJustFinish?: boolean }) => void): void }).addListener?.('playbackStatusUpdate', (status) => {
          if (status?.didJustFinish) finishSpeaking();
        });
        player.play();
        setTimeout(() => {
          if (speaking) finishSpeaking();
        }, 60000);
        return;
      } catch {
        cache.delete(hash);
        cacheOrder = cacheOrder.filter((k) => k !== hash);
      }
    } else {
      cache.delete(hash);
      cacheOrder = cacheOrder.filter((k) => k !== hash);
    }
  }

  try {
    const res = await fetch(OPENAI_TTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'shimmer',
        input: clean,
        response_format: 'mp3',
        speed: 1.1,
      }),
    });

    if (!res.ok) {
      fallbackSpeak(clean);
      return;
    }

    const arrayBuffer = await res.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    dir.create({ idempotent: true });
    const file = new File(dir, `${hash}.mp3`);
    file.create({ overwrite: true });
    file.write(bytes);
    fileUri = file.uri;
    cache.set(hash, fileUri);
    cacheOrder.push(hash);
    pruneCache();

    const player = createAudioPlayer(fileUri);
    if (!player) {
      fallbackSpeak(clean);
      return;
    }
    currentPlayer = player;
    (player as { addListener?(event: string, cb: (s: { didJustFinish?: boolean }) => void): void }).addListener?.('playbackStatusUpdate', (status) => {
      if (status?.didJustFinish) finishSpeaking();
    });
    player.play();
    setTimeout(() => {
      if (speaking) finishSpeaking();
    }, 60000);
  } catch {
    fallbackSpeak(clean);
  }
}

export function speakAsVisby(text: string, onDone?: () => void): void {
  stopVisbyTTS();
  const clean = stripEmoji(text);
  if (!clean) {
    onDone?.();
    return;
  }

  speaking = true;
  doneCallback = onDone ?? null;

  fetchAndPlayOpenAITTS(clean);
}

export function stopVisbyTTS(): void {
  if (currentPlayer) {
    try {
      (currentPlayer as { remove?: () => void }).remove?.();
    } catch {
      // ignore
    }
    currentPlayer = null;
  }
  Speech.stop();
  speaking = false;
  doneCallback = null;
}

export function isVisbySpeaking(): boolean {
  return speaking;
}
