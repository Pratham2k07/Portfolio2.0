// AudioEngine.ts — Procedural Atmospheric & Architectural Sound Design
// High-fidelity, subtle procedural synthesis via Web Audio API.

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private isMuted = true;

  // Background Music (WhatsApp Audio track)
  private bgMusic: HTMLAudioElement | null = null;
  private bgMusicVolume = 0.55;

  // Dragon Wings Flapping Sound
  private dragonWingsAudio: HTMLAudioElement | null = null;
  private currentWingsVolume = 0;
  private isWingsPlaying = false;

  // Sound nodes
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private gateGain: GainNode | null = null;

  // Oscillators & noise
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private windNode: AudioBufferSourceNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private gateNoiseSource: AudioBufferSourceNode | null = null;
  private gateFilter: BiquadFilterNode | null = null;

  public init() {
    this.setupDragonWings();
    if (this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // 1. Deep Sub-Drone Architecture
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(85, this.ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      // Low fundamental (43.65 Hz = F1)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(43.65, this.ctx.currentTime);

      // Octave higher with slight detune for subtle acoustic beating
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(87.3, this.ctx.currentTime);
      this.droneOsc2.detune.setValueAtTime(2.5, this.ctx.currentTime);

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();

      // 2. Distant Wind & Atmospheric Resonance
      this.setupWind();

      // 3. Gate Mechanical Hydraulic / Heavy Friction System
      this.setupGateResonance();

      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioEngine initialization deferred until user gesture:', e);
    }
  }

  private setupDragonWings() {
    if (this.dragonWingsAudio) return;
    try {
      // Primary source: /dragon_wings.mp3 (exact copy of WhatsApp Audio)
      this.dragonWingsAudio = new Audio('/dragon_wings.mp3');
      this.dragonWingsAudio.loop = true;
      this.dragonWingsAudio.volume = 0;
      this.dragonWingsAudio.playbackRate = 1.0;
      this.dragonWingsAudio.onerror = () => {
        if (this.dragonWingsAudio) {
          this.dragonWingsAudio.src = encodeURI('/WhatsApp Audio 2026-09-28 at 00.27.43.mpeg');
        }
      };
    } catch (e) {
      console.warn('AudioEngine: Dragon wings audio setup error:', e);
    }
  }

  // Reactive dragon wing sound: loops dynamically during flight, modulating volume and flap speed
  public updateDragonWings(
    active: boolean,
    speed: number,
    isAccelerating: boolean,
    isBraking: boolean = false,
    isClimbingOrDiving: boolean = false
  ) {
    if (!this.dragonWingsAudio) {
      this.setupDragonWings();
    }
    if (!this.dragonWingsAudio) return;

    if (!active || this.isMuted) {
      if (this.currentWingsVolume > 0.01) {
        this.currentWingsVolume = Math.max(0, this.currentWingsVolume - 0.05);
        this.dragonWingsAudio.volume = this.currentWingsVolume;
      } else {
        this.currentWingsVolume = 0;
        this.dragonWingsAudio.volume = 0;
        if (this.isWingsPlaying) {
          this.dragonWingsAudio.pause();
          this.isWingsPlaying = false;
        }
      }
      return;
    }

    // Active in flight mode and unmuted: ensure playback
    if (!this.isWingsPlaying) {
      const playPromise = this.dragonWingsAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isWingsPlaying = true;
          })
          .catch(() => {
            // Resumes on user interaction
          });
      }
    }

    // Target volume based on flight dynamics:
    // Base glide: 0.40, accelerating thrust: up to 0.78, braking: 0.28
    let targetVol = 0.40 + Math.min(speed / 26, 1) * 0.35;
    if (isAccelerating) targetVol += 0.08;
    if (isBraking) targetVol = 0.28;
    if (isClimbingOrDiving) targetVol += 0.06;
    targetVol = Math.min(0.85, Math.max(0.2, targetVol));

    // Smooth lerp volume to eliminate any audio pops
    this.currentWingsVolume += (targetVol - this.currentWingsVolume) * 0.12;
    this.dragonWingsAudio.volume = Math.max(0, Math.min(1, this.currentWingsVolume));

    // Dynamic playback rate matching wing flap animation frequency:
    // Gliding: 0.88x, Thrusting: 1.25x
    let targetRate = 0.90 + (speed / 26) * 0.32;
    if (isAccelerating) targetRate = Math.max(targetRate, 1.25);
    if (isBraking) targetRate = 0.82;
    this.dragonWingsAudio.playbackRate = Math.max(0.75, Math.min(1.4, targetRate));
  }

  private setupWind() {
    if (!this.ctx || !this.masterGain) return;

    // Generate 4-second pink noise buffer
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    this.windNode = this.ctx.createBufferSource();
    this.windNode.buffer = noiseBuffer;
    this.windNode.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.setValueAtTime(220, this.ctx.currentTime);
    this.windFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.025, this.ctx.currentTime);

    this.windNode.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    this.windNode.start();
  }

  private setupGateResonance() {
    if (!this.ctx || !this.masterGain) return;

    // Low rumble noise for stone/heavy metal friction
    const bufferSize = this.ctx.sampleRate * 3;
    const rumbleBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const channel = rumbleBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      channel[i] = (Math.random() * 2 - 1) * 0.2;
    }

    this.gateNoiseSource = this.ctx.createBufferSource();
    this.gateNoiseSource.buffer = rumbleBuffer;
    this.gateNoiseSource.loop = true;

    this.gateFilter = this.ctx.createBiquadFilter();
    this.gateFilter.type = 'lowpass';
    this.gateFilter.frequency.setValueAtTime(65, this.ctx.currentTime);
    this.gateFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    this.gateGain = this.ctx.createGain();
    this.gateGain.gain.setValueAtTime(0, this.ctx.currentTime); // initially silent

    this.gateNoiseSource.connect(this.gateFilter);
    this.gateFilter.connect(this.gateGain);
    this.gateGain.connect(this.masterGain);

    this.gateNoiseSource.start();
  }

  // Reactive parameters tied to scene progress (0 to 1)
  public updateSceneProgress(progress: number, gateOpeningAmount: number) {
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Atmospheric reveal modulates drone presence
    if (this.droneFilter && this.droneGain) {
      const droneFreq = 75 + progress * 65;
      this.droneFilter.frequency.setTargetAtTime(droneFreq, t, 0.2);
      const droneVol = 0.03 + Math.min(progress, 0.8) * 0.04;
      this.droneGain.gain.setTargetAtTime(droneVol, t, 0.2);
    }

    // Wind filter breathes slightly as we move closer
    if (this.windFilter && this.windGain) {
      const windFreq = 180 + Math.sin(progress * Math.PI) * 140;
      this.windFilter.frequency.setTargetAtTime(windFreq, t, 0.3);
    }

    // Heavy gate opening mechanical resonance
    if (this.gateGain && this.gateFilter) {
      if (gateOpeningAmount > 0.01 && gateOpeningAmount < 0.95) {
        // Active mechanical movement sound
        const gateVol = Math.sin(gateOpeningAmount * Math.PI) * 0.09;
        this.gateGain.gain.setTargetAtTime(gateVol, t, 0.1);
        this.gateFilter.frequency.setTargetAtTime(55 + gateOpeningAmount * 50, t, 0.1);
      } else {
        this.gateGain.gain.setTargetAtTime(0, t, 0.4);
      }
    }
  }

  private setupBgMusic() {
    if (this.bgMusic) return;
    try {
      this.bgMusic = new Audio('/dragon_wings.mp3');
      this.bgMusic.loop = true;
      this.bgMusic.volume = this.isMuted ? 0 : this.bgMusicVolume;
    } catch (e) {
      console.warn('AudioEngine: Background music setup error:', e);
    }
  }

  public playBgMusic() {
    if (!this.bgMusic) {
      this.setupBgMusic();
    }
    if (this.bgMusic) {
      this.bgMusic.volume = this.bgMusicVolume;
      const promise = this.bgMusic.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.log('AudioEngine: Waiting for user gesture to play audio:', err);
        });
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;

    if (this.dragonWingsAudio) {
      if (muted) {
        this.dragonWingsAudio.pause();
        this.isWingsPlaying = false;
      }
    }

    if (this.bgMusic) {
      if (muted) {
        this.bgMusic.pause();
      } else {
        this.bgMusic.volume = this.bgMusicVolume;
        this.bgMusic.play().catch(() => {});
      }
    }

    if (!this.ctx) {
      if (!muted) this.init();
      return;
    }

    if (this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }

    if (this.masterGain) {
      const targetGain = muted ? 0 : 0.85;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.3);
    }
  }

  public toggleMute(): boolean {
    if (!this.isInitialized) {
      this.init();
    }
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const audioEngine = new AudioEngine();
