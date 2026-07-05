// src/hooks/useFan.ts

import { useCallback } from "react";

import { useFanStore } from "@/src/store/fan";

export default function useFan() {
  const state = useFanStore((s) => s.state);
  const visible = useFanStore((s) => s.visible);
  const expanded = useFanStore((s) => s.expanded);
  const muted = useFanStore((s) => s.muted);
  const message = useFanStore((s) => s.message);
  const transcript = useFanStore((s) => s.transcript);

  const show = useFanStore((s) => s.show);
  const hide = useFanStore((s) => s.hide);

  const open = useFanStore((s) => s.open);
  const close = useFanStore((s) => s.close);
  const toggle = useFanStore((s) => s.toggle);

  const setState = useFanStore((s) => s.setState);
  const setMuted = useFanStore((s) => s.setMuted);
  const toggleMute = useFanStore((s) => s.toggleMute);

  const setMessage = useFanStore((s) => s.setMessage);
  const setTranscript = useFanStore((s) => s.setTranscript);

  const reset = useFanStore((s) => s.reset);

  const startListening = useCallback(() => {
    setState("listening");
    setMessage("Listening...");
  }, [setState, setMessage]);

  const startThinking = useCallback(() => {
    setState("thinking");
    setMessage("Thinking...");
  }, [setState, setMessage]);

  const startSpeaking = useCallback(() => {
    setState("speaking");
    setMessage("Speaking...");
  }, [setState, setMessage]);

  const stop = useCallback(() => {
    setState("idle");

    setMessage(
      muted
        ? "Double tap to chat"
        : 'Say "Hey FAN"'
    );

    setTranscript("");
  }, [muted, setState, setMessage, setTranscript]);

  return {
    // State
    state,
    visible,
    expanded,
    muted,
    message,
    transcript,

    // UI
    show,
    hide,
    open,
    close,
    toggle,

    // Voice
    startListening,
    startThinking,
    startSpeaking,
    stop,

    // Store
    setState,
    setMuted,
    toggleMute,
    setMessage,
    setTranscript,
    reset,
  };
}