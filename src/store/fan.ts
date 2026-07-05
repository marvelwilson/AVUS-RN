import { create } from "zustand";

export type FanState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "muted";

interface FanStore {
  // UI
  visible: boolean;
  expanded: boolean;

  // Voice
  state: FanState;
  muted: boolean;

  // Conversation
  message: string;
  transcript: string;

  // Actions
  show: () => void;
  hide: () => void;

  open: () => void;
  close: () => void;
  toggle: () => void;

  setState: (state: FanState) => void;

  setMuted: (muted: boolean) => void;
  toggleMute: () => void;

  setMessage: (message: string) => void;
  setTranscript: (text: string) => void;

  reset: () => void;
}

export const useFanStore = create<FanStore>((set) => ({
  visible: true,
  expanded: false,

  state: "idle",
  muted: false,

  message: 'Say "Hey FAN"',
  transcript: "",

  show: () =>
    set({
      visible: true,
    }),

  hide: () =>
    set({
      visible: false,
    }),

  open: () =>
    set({
      expanded: true,
    }),

  close: () =>
    set({
      expanded: false,
    }),

  toggle: () =>
    set((state) => ({
      expanded: !state.expanded,
    })),

  setState: (state) =>
    set({
      state,
    }),

  setMuted: (muted) =>
    set({
      muted,
      message: muted
        ? "Double tap to chat"
        : 'Say "Hey FAN"',
    }),

  toggleMute: () =>
    set((state) => ({
      muted: !state.muted,
      message: state.muted
        ? 'Say "Hey FAN"'
        : "Double tap to chat",
    })),

  setMessage: (message) =>
    set({
      message,
    }),

  setTranscript: (transcript) =>
    set({
      transcript,
    }),

  reset: () =>
    set({
      state: "idle",
      expanded: false,
      transcript: "",
      message: 'Say "Hey FAN"',
    }),
}));