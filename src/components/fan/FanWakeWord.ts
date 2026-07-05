export type WakeWordState =
  | "stopped"
  | "listening"
  | "detected";

type Callback = () => void;

class FanWakeWord {
  private started = false;

  private muted = false;

  private callback?: Callback;

  private state: WakeWordState = "stopped";

  start(callback: Callback) {
    if (this.started) return;

    this.started = true;
    this.callback = callback;
    this.state = "listening";

    console.log("[FAN] Wake word started");

    /**
     * Replace this section with your SDK.
     *
     * Example:
     *
     * FanSDK.startWakeWord({
     *    wakeWord: "hey fan",
     *    onDetected: this.detect
     * });
     */
  }

  stop() {
    this.started = false;
    this.state = "stopped";

    console.log("[FAN] Wake word stopped");

    /**
     * FanSDK.stopWakeWord();
     */
  }

  restart() {
    if (!this.callback) return;

    this.stop();

    this.start(this.callback);
  }

  mute() {
    this.muted = true;
  }

  unmute() {
    this.muted = false;
  }

  isMuted() {
    return this.muted;
  }

  isListening() {
    return this.started;
  }

  getState() {
    return this.state;
  }

  /**
   * Call this from your SDK
   * when "Hey FAN" is detected.
   */
  detect = () => {
    if (this.muted) return;

    this.state = "detected";

    console.log("[FAN] Wake word detected");

    this.callback?.();

    this.state = "listening";
  };
}

export default new FanWakeWord();