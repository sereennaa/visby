import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

let speaking = false;
let doneCallback: (() => void) | null = null;

const VISBY_VOICE_CONFIG: Speech.SpeechOptions = {
  language: 'en-US',
  rate: Platform.OS === 'ios' ? 0.92 : 0.88,
  pitch: 1.15,
};

function stripEmoji(text: string): string {
  return text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, '').trim();
}

export function speakAsVisby(text: string, onDone?: () => void): void {
  Speech.stop();
  const clean = stripEmoji(text);
  if (!clean) {
    onDone?.();
    return;
  }

  speaking = true;
  doneCallback = onDone ?? null;

  Speech.speak(clean, {
    ...VISBY_VOICE_CONFIG,
    onDone: () => {
      speaking = false;
      const cb = doneCallback;
      doneCallback = null;
      cb?.();
    },
    onStopped: () => {
      speaking = false;
      doneCallback = null;
    },
    onError: () => {
      speaking = false;
      const cb = doneCallback;
      doneCallback = null;
      cb?.();
    },
  });
}

export function stopVisbyTTS(): void {
  Speech.stop();
  speaking = false;
  doneCallback = null;
}

export function isVisbySpeaking(): boolean {
  return speaking;
}
