// src/components/fan/FanSpeech.ts

export type SpeechState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

type Listener = (state: SpeechState) => void;

class FanSpeech {
  private state: SpeechState = "idle";

  private listeners = new Set<Listener>();

  getState() {
    return this.state;
  }

  setState(state: SpeechState) {
    this.state = state;

    this.listeners.forEach(listener => listener(state));
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);

    listener(this.state);

    return () => {
      this.listeners.delete(listener);
    };
  }

  reset() {
    this.setState("idle");
  }

  startListening() {
    this.setState("listening");
  }

  thinking() {
    this.setState("thinking");
  }

  speaking() {
    this.setState("speaking");
  }

  error() {
    this.setState("error");
  }

  finish() {
    this.setState("idle");
  }
}

export default new FanSpeech();