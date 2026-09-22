/** Quiet procedural Foley. No recordings, network requests, or autoplay. */
export class RoomAudio {
  private context?: AudioContext;
  private master?: GainNode;
  private fan?: GainNode;
  private lastRoll = 0;
  private enabled = true;
  private running = false;
  unlock() {
    if (!this.context) {
      const ctx = this.context = new AudioContext();
      this.master = ctx.createGain(); this.master.gain.value = 0.35; this.master.connect(ctx.destination);
      const source = ctx.createBufferSource(); source.buffer = this.noise(2); source.loop = true;
      const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 650;
      this.fan = ctx.createGain(); this.fan.gain.value = 0;
      source.connect(filter).connect(this.fan).connect(this.master); source.start();
    }
    void this.context.resume().catch(() => {});
    this.sync();
  }
  private noise(seconds: number) {
    const ctx = this.context!; const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
  configure(enabled: boolean, running: boolean) { this.enabled = enabled; this.running = running; this.sync(); }
  private sync() {
    const ctx = this.context; if (!ctx || !this.master || !this.fan) return;
    this.master.gain.setTargetAtTime(this.enabled && !document.hidden ? 0.35 : 0, ctx.currentTime, 0.06);
    this.fan.gain.setTargetAtTime(this.running ? 0.1 : 0, ctx.currentTime, 0.35);
  }
  click() { this.effect(0.045, 1800, 0.12); }
  roll() {
    const now = performance.now(); if (now - this.lastRoll < 85) return;
    this.lastRoll = now; this.effect(0.18, 460, 0.11);
    const ctx = this.context; if (!ctx || !this.master) return;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.frequency.setValueAtTime(155, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(95, ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.008, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    osc.connect(gain).connect(this.master); osc.start(); osc.stop(ctx.currentTime + 0.2);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  }
  private effect(seconds: number, frequency: number, volume: number) {
    const ctx = this.context; if (!ctx || !this.master || !this.enabled) return;
    const source = ctx.createBufferSource(); source.buffer = this.noise(seconds);
    const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = frequency;
    const gain = ctx.createGain(); gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + seconds);
    source.connect(filter).connect(gain).connect(this.master); source.start();
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
  }
}
