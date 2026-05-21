// Web Audio API Hip-Hop Beat Synthesizer
// Generates live, continuous, professional-grade loopable hip-hop beats in the browser!

export class HipHopAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private bpm: number = 94;
  private beatType: 'Boom Bap' | 'Trap' | 'West Coast' = 'Trap';
  private timerId: number | null = null;
  private nextNoteTime: number = 0;
  private currentBeat: number = 0;
  private analyserNode: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private customSourceNode: MediaElementAudioSourceNode | null = null;

  // Sound generator parameters
  constructor() {}

  public initialize() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 64;
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      
      this.analyserNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public connectCustomAudio(audioEl: HTMLAudioElement) {
    this.initialize();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.customSourceNode && this.ctx && this.analyserNode) {
      try {
        this.customSourceNode = this.ctx.createMediaElementSource(audioEl);
        this.customSourceNode.connect(this.analyserNode);
      } catch (err) {
        console.warn("Web Audio media element route bound:", err);
      }
    }
  }

  public start(bpm: number, beatType: 'Boom Bap' | 'Trap' | 'West Coast') {
    this.initialize();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    
    if (this.isPlaying) return;
    
    this.bpm = bpm;
    this.beatType = beatType;
    this.isPlaying = true;
    this.currentBeat = 0;
    this.nextNoteTime = this.ctx!.currentTime;
    
    // Web Audio Synthesizer scheduler is completely disabled. Only real uploaded custom audio is piped.
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public setBpm(bpm: number) {
    this.bpm = bpm;
  }

  public setBeatType(type: 'Boom Bap' | 'Trap' | 'West Coast') {
    this.beatType = type;
  }

  public changeVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(volume ?? 0.5, this.ctx.currentTime);
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  public getByteFrequencyData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  private scheduler() {
    if (!this.isPlaying || !this.ctx) return;

    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      this.scheduleBeat(this.currentBeat, this.nextNoteTime);
      this.advanceBeat();
    }

    // Schedule next polling check
    this.timerId = setTimeout(() => this.scheduler(), 25) as any;
  }

  private advanceBeat() {
    const secondsPerBeat = 60.0 / this.bpm;
    const subdivision = secondsPerBeat / 4; // 16th notes
    this.nextNoteTime += subdivision;
    
    this.currentBeat = (this.currentBeat + 1) % 16;
  }

  private scheduleBeat(step: number, time: number) {
    if (!this.ctx || !this.analyserNode) return;

    // 16-step sequencer trigger definitions
    const isTrap = this.beatType === 'Trap';
    const isWest = this.beatType === 'West Coast';
    const isBoomBap = this.beatType === 'Boom Bap';

    // 1. Kick Drum
    let playKick = false;
    if (isTrap) {
      playKick = step === 0 || step === 4 || step === 8 || step === 11;
    } else if (isBoomBap) {
      playKick = step === 0 || step === 3 || step === 8 || step === 9;
    } else { // West Coast
      playKick = step === 0 || step === 6 || step === 8 || step === 14;
    }

    if (playKick) {
      this.playKickBuffer(time, isTrap ? 55 : 48); // Trap has higher pitch 808 rattle
    }

    // 2. Snare / Clap
    let playSnare = step === 4 || step === 12;
    if (playSnare) {
      this.playSnareBuffer(time, isBoomBap ? 0.4 : 0.3);
    }

    // 3. Hi-Hats
    let playHat = false;
    let hatVolume = 0.08;
    if (isTrap) {
      // Rapid trap hats - play on all even or custom steps
      playHat = true;
      if (step % 3 === 0) hatVolume = 0.14; // accent
    } else {
      playHat = step % 2 === 0;
    }
    if (playHat) {
      this.playHatBuffer(time, hatVolume);
    }

    // 4. Bass Melodic Line / Synth Chord Loop
    if (step % 4 === 0) {
      let rootFreq = 55; // A1
      if (step === 4) rootFreq = 65.4; // C2
      if (step === 8) rootFreq = 48.9; // G1
      if (step === 12) rootFreq = 58.2; // A#1/A1
      
      this.playSubBass(time, rootFreq, secondsPerBeat() * 0.9);
    }

    // 5. West Coast High Synth Lead / Boom Bap Piano Chords
    if (isWest) {
      // Classic sliding G-Funk high sine whistle on specific beats
      const notes = [880, 987, 1046, 880]; // A5, B5, C6
      const playWestWhistle = step === 2 || step === 3 || step === 6 || step === 10 || step === 14;
      if (playWestWhistle) {
        this.playMelodyOsc(time, notes[step % notes.length], 'sine', 0.04, 0.15);
      }
    } else if (isBoomBap) {
      // Smooth visual synth jazzy rhodes chord triggers
      if (step === 0 || step === 8) {
        const root = step === 0 ? 220 : 196; // A3 vs G3
        this.playRhodesChord(time, root);
      }
    } else if (isTrap) {
      // Dark gothic bells
      if (step === 0 || step === 6 || step === 10) {
        const notes = [440, 523, 659]; // Dark Am chord
        this.playMelodyOsc(time, notes[step % 3], 'triangle', 0.08, 0.35);
      }
    }

    // Inner helper functions to preserve closure scope
    function secondsPerBeat() {
      return 60.0 / 94; // approx duration
    }
  }

  // Synthesis helpers using AudioContext Nodes
  private playKickBuffer(time: number, freq: number) {
    if (!this.ctx || !this.analyserNode) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.analyserNode);
    
    // Pitch envelope
    osc.frequency.setValueAtTime(freq * 2.5, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.18);
    
    // Amplitude envelope
    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
    
    osc.start(time);
    osc.stop(time + 0.24);
  }

  private playSnareBuffer(time: number, volume: number) {
    if (!this.ctx || !this.analyserNode) return;

    // Snare white noise creation
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter white noise to sound crisper
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1200;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(volume, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.analyserNode);

    // Dynamic snap resonator osc
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snap.type = 'triangle';
    snap.frequency.setValueAtTime(180, time);
    
    snapGain.gain.setValueAtTime(0.4, time);
    snapGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    snap.connect(snapGain);
    snapGain.connect(this.analyserNode);

    noise.start(time);
    noise.stop(time + 0.2);
    
    snap.start(time);
    snap.stop(time + 0.06);
  }

  private playHatBuffer(time: number, volume: number) {
    if (!this.ctx || !this.analyserNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.value = 8000;

    filter.type = 'highpass';
    filter.frequency.value = 6500;

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyserNode);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  private playSubBass(time: number, freq: number, duration: number) {
    if (!this.ctx || !this.analyserNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc.connect(gain);
    gain.connect(this.analyserNode);

    osc.start(time);
    osc.stop(time + duration + 0.1);
  }

  private playMelodyOsc(time: number, freq: number, type: 'sine' | 'triangle', volume: number, duration: number) {
    if (!this.ctx || !this.analyserNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.analyserNode);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  private playRhodesChord(time: number, rootFreq: number) {
    if (!this.ctx || !this.analyserNode) return;

    // Rhodes piano sound synthezised via multi-frequency triangle waves
    const intervals = [1.0, 1.2, 1.5, 1.8]; // Root, Minor 3rd, Fifth, Minor 7th
    intervals.forEach((ratio) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(rootFreq * ratio, time);

      gain.gain.setValueAtTime(0.06, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.82);

      osc.connect(gain);
      gain.connect(this.analyserNode!);

      osc.start(time);
      osc.stop(time + 0.9);
    });
  }
}
