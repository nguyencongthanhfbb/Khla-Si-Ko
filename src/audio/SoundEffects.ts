/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private hapticsEnabled: boolean = true;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setHaptics(enabled: boolean) {
    this.hapticsEnabled = enabled;
  }

  public getIsMuted() {
    return this.isMuted;
  }

  public getHapticsEnabled() {
    return this.hapticsEnabled;
  }

  // --- Haptic Feedback ---
  public triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'victory') {
    if (!this.hapticsEnabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      if (type === 'light') navigator.vibrate(15);
      else if (type === 'medium') navigator.vibrate(35);
      else if (type === 'heavy') navigator.vibrate([40, 30, 60]);
      else if (type === 'victory') navigator.vibrate([80, 50, 80, 50, 120]);
    } catch {
      // Ignore vibration errors
    }
  }

  // --- Sound Synthesis ---

  /** Soft wooden clack / tap for UI selection & button clicks */
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    this.triggerHaptic('light');
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  /** Cheerful wooden pop when placing a Cow on the board */
  public playCowPlace() {
    const ctx = this.getContext();
    if (!ctx) return;

    this.triggerHaptic('medium');
    const now = ctx.currentTime;

    // Harmonic bell tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
    osc2.frequency.setValueAtTime(1046.5, now); // C6

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.26);
    osc2.stop(now + 0.26);
  }

  /** Playful jump hop sound for Tiger normal movement */
  public playTigerMove() {
    const ctx = this.getContext();
    if (!ctx) return;

    this.triggerHaptic('light');
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(330, now + 0.22);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  /** Gentle soft wooden slide for Cow normal movement */
  public playCowMove() {
    const ctx = this.getContext();
    if (!ctx) return;

    this.triggerHaptic('light');
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(392, now); // G4
    osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.15); // C5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  /** Exciting cartoon capture sound: whoosh + jump + star pop */
  public playCapture() {
    const ctx = this.getContext();
    if (!ctx) return;

    this.triggerHaptic('heavy');
    const now = ctx.currentTime;

    // 1. Whoosh pitch sweep
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.2);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.26);

    // 2. Star pop sparkle harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.35);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.35, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.46);
  }

  /** Celebratory Victory Fanfare */
  public playVictory(winner: 'COW' | 'TIGER') {
    const ctx = this.getContext();
    if (!ctx) return;

    this.triggerHaptic('victory');
    const now = ctx.currentTime;

    const notes =
      winner === 'TIGER'
        ? [392, 523.25, 659.25, 783.99, 1046.5] // G4, C5, E5, G5, C6
        : [523.25, 659.25, 783.99, 880, 1046.5]; // C5, E5, G5, A5, C6

    notes.forEach((freq, i) => {
      const startTime = now + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i === notes.length - 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.28, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + (i === notes.length - 1 ? 0.8 : 0.28));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.85);
    });
  }

  /** Soft invalid move bump */
  public playIllegal() {
    const ctx = this.getContext();
    if (!ctx) return;

    this.triggerHaptic('light');
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }
}

export const sound = new SoundSystem();
