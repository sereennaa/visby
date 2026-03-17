import { create } from 'zustand';
import { hapticService } from '../services/haptics';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  createdAt: number;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

let idCounter = 0;
const TOAST_DURATION_MS = 3500;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (message: string, type: ToastType = 'info') => {
    const id = `toast-${++idCounter}-${Date.now()}`;
    const item: ToastItem = { id, message, type, createdAt: Date.now() };
    set((s) => ({ toasts: [...s.toasts, item] }));

    if (type === 'success') hapticService.success();
    else if (type === 'error') hapticService.error();
    else hapticService.tap();

    setTimeout(() => {
      get().dismissToast(id);
    }, TOAST_DURATION_MS);
  },

  dismissToast: (id: string) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

/** Call from anywhere: showToast('Stamp collected!', 'success') */
export function showToast(message: string, type: ToastType = 'info'): void {
  useToastStore.getState().showToast(message, type);
}
