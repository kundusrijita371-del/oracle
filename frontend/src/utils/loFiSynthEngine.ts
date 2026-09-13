/**
 * Web Audio API Lo-Fi Beat & Ambient Atmosphere Synthesizer.
 * Creates smooth Rhodes-style chill chords, sub-bass, vinyl crackle,
 * and ambient soundscapes (rain, fire, wind) entirely in the browser.
 */

export interface LoFiTrack {
  id: string;
  title: string;
  vibe: string;
  bpm: number;
  chords: number[][]; // chord frequencies in Hz
  bassNotes: number[];
}

export const LOFI_PLAYLIST: LoFiTrack[] = [
  {
    id: 'track-midnight',
    title: 'Midnight Starlight Alchemy',
    vibe: 'Dreamy & Relaxed (72 BPM)',
    bpm: 72,
    chords: [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 349.23]  // G7
    ],
    bassNotes: [65.41, 55.0, 43.65, 49.0]
  },
  {
    id: 'track-campfire',
    title: 'Campfire Guild Chills',
    vibe: 'Warm Amber Nostalgia (68 BPM)',
    bpm: 68,
    chords: [
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [196.0, 246.94, 293.66, 392.0],  // G7
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 440.0]   // Am7
    ],
    bassNotes: [73.42, 49.0, 65.41, 55.0]
  },
  {
    id: 'track-library',
    title: 'Arcane Study Sanctuary',
    vibe: 'Deep Focus & Clarity (78 BPM)',
    bpm: 78,
    chords: [
      [349.23, 440.0, 523.25, 659.25], // Fmaj7
      [329.63, 392.0, 493.88, 587.33], // Em7
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [261.63, 329.63, 392.0, 523.25]  // Cmaj7
    ],
    bassNotes: [87.31, 82.41, 73.42, 65.41]
  }
];

class LoFiSynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackIdx: number = 0;
  private timerId: any = null;
  private step: number = 0;

  // Master Gain
  private masterGain: GainNode | null = null;
  private masterVolume: number = 0.7;

  // Ambient Gain Nodes
  private vinylGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private fireGain: GainNode | null = null;

  private rainPlaying: boolean = false;
  private firePlaying: boolean = false;
  private vinylLevel: number = 0.25;
  private rainLevel: number = 0.2;
  private fireLevel: number = 0.15;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a soft Rhodes chord with gentle vibrato and warm lowpass filter
  private playChord(frequencies: number[], duration: number) {
    const ctx = this.getContext();
    const master = this.masterGain;
    if (!master) return;

    frequencies.forEach((freq) => {
      // Main tone
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Warmer tone with lowpass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + duration);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.002, ctx.currentTime); // Slight detune for warmth

      // Smooth attack and long warm decay
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration - 0.05);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);
    });
  }

  // Play a warm sub-bass note
  private playBass(freq: number, duration: number) {
    const ctx = this.getContext();
    const master = this.masterGain;
    if (!master) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, ctx.currentTime);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration - 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  // Chill lo-fi kick drum
  private playKick() {
    const ctx = this.getContext();
    const master = this.masterGain;
    if (!master) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(master);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  // Soft brushed snare / rimshot
  private playSnare() {
    const ctx = this.getContext();
    const master = this.masterGain;
    if (!master) return;

    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    noise.start();
    noise.stop(ctx.currentTime + 0.12);
  }

  // Soft hi-hat tick
  private playHiHat() {
    const ctx = this.getContext();
    const master = this.masterGain;
    if (!master) return;

    const bufferSize = Math.floor(ctx.sampleRate * 0.04);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    noise.start();
    noise.stop(ctx.currentTime + 0.04);
  }

  // Vinyl Crackle Noise loop
  private startVinylCrackle() {
    const ctx = this.getContext();
    if (this.vinylGain || !this.masterGain) return;

    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Gentle pink noise + random dust pop spikes
      const white = Math.random() * 2 - 1;
      const pop = Math.random() < 0.0015 ? (Math.random() * 1.5 - 0.75) : 0;
      data[i] = white * 0.03 + pop;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);

    this.vinylGain = ctx.createGain();
    this.vinylGain.gain.setValueAtTime(this.vinylLevel, ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain);

    noise.start();
  }

  // Continuous Gentle Rain Ambience
  public toggleRain(enable?: boolean): boolean {
    const ctx = this.getContext();
    const targetState = enable !== undefined ? enable : !this.rainPlaying;
    this.rainPlaying = targetState;

    if (this.rainPlaying) {
      if (!this.rainGain && this.masterGain) {
        const bufferSize = ctx.sampleRate * 4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);

        this.rainGain = ctx.createGain();
        this.rainGain.gain.setValueAtTime(this.rainLevel, ctx.currentTime);

        noise.connect(filter);
        filter.connect(this.rainGain);
        this.rainGain.connect(this.masterGain);

        noise.start();
      } else if (this.rainGain) {
        this.rainGain.gain.setTargetAtTime(this.rainLevel, ctx.currentTime, 0.2);
      }
    } else {
      if (this.rainGain) {
        this.rainGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
      }
    }
    return this.rainPlaying;
  }

  // Continuous Cozy Fireplace Ambience
  public toggleFire(enable?: boolean): boolean {
    const ctx = this.getContext();
    const targetState = enable !== undefined ? enable : !this.firePlaying;
    this.firePlaying = targetState;

    if (this.firePlaying) {
      if (!this.fireGain && this.masterGain) {
        const bufferSize = ctx.sampleRate * 4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const crackle = Math.random() < 0.004 ? (Math.random() * 1.8 - 0.9) : (Math.random() * 0.05);
          data[i] = crackle;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        this.fireGain = ctx.createGain();
        this.fireGain.gain.setValueAtTime(this.fireLevel, ctx.currentTime);

        noise.connect(filter);
        filter.connect(this.fireGain);
        this.fireGain.connect(this.masterGain);

        noise.start();
      } else if (this.fireGain) {
        this.fireGain.gain.setTargetAtTime(this.fireLevel, ctx.currentTime, 0.2);
      }
    } else {
      if (this.fireGain) {
        this.fireGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
      }
    }
    return this.firePlaying;
  }

  // Sequencer loop
  private tick() {
    if (!this.isPlaying) return;

    const track = LOFI_PLAYLIST[this.currentTrackIdx];
    const secondsPerBeat = 60 / track.bpm;
    const barStep = this.step % 16;
    const chordIdx = Math.floor(barStep / 4) % track.chords.length;

    // Chord trigger every 4 steps (start of each bar)
    if (barStep % 4 === 0) {
      this.playChord(track.chords[chordIdx], secondsPerBeat * 3.8);
      this.playBass(track.bassNotes[chordIdx], secondsPerBeat * 3.5);
    }

    // Drums
    if (barStep === 0 || barStep === 6 || barStep === 10) {
      this.playKick();
    }
    if (barStep === 4 || barStep === 12) {
      this.playSnare();
    }
    if (barStep % 2 === 0) {
      this.playHiHat();
    }

    this.step++;
  }

  public play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.getContext();
    this.startVinylCrackle();

    const track = LOFI_PLAYLIST[this.currentTrackIdx];
    const stepDurationMs = (60 / track.bpm / 4) * 1000;

    this.timerId = setInterval(() => {
      this.tick();
    }, stepDurationMs);
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public nextTrack(): LoFiTrack {
    this.currentTrackIdx = (this.currentTrackIdx + 1) % LOFI_PLAYLIST.length;
    this.step = 0;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
    return LOFI_PLAYLIST[this.currentTrackIdx];
  }

  public prevTrack(): LoFiTrack {
    this.currentTrackIdx = (this.currentTrackIdx - 1 + LOFI_PLAYLIST.length) % LOFI_PLAYLIST.length;
    this.step = 0;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
    return LOFI_PLAYLIST[this.currentTrackIdx];
  }

  public setVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getCurrentTrack(): LoFiTrack {
    return LOFI_PLAYLIST[this.currentTrackIdx];
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      track: LOFI_PLAYLIST[this.currentTrackIdx],
      rainActive: this.rainPlaying,
      fireActive: this.firePlaying,
      volume: this.masterVolume
    };
  }
}

export const lofiEngine = new LoFiSynthEngine();
