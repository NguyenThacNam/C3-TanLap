/**
 * Công cụ âm thanh tương lai sử dụng Web Audio API
 */
class AudioEngine {
  private ctx: AudioContext | null = null;

  private async init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  private createOscillator(freq: number, type: OscillatorType = 'sine', duration: number = 0.1) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playSelect() {
    this.createOscillator(880, 'sine', 0.05);
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    [440, 880, 1320].forEach((freq, i) => {
      setTimeout(() => this.createOscillator(freq, 'sine', 0.2), i * 50);
    });
  }

  playError() {
    this.init();
    if (!this.ctx) return;
    
    this.createOscillator(110, 'sawtooth', 0.3);
    setTimeout(() => this.createOscillator(110, 'sawtooth', 0.3), 50);
  }

  playComplete() {
    this.init();
    if (!this.ctx) return;
    
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((f, i) => {
      setTimeout(() => this.createOscillator(f, 'sine', 0.4), i * 100);
    });
  }
}

export const audio = new AudioEngine();
