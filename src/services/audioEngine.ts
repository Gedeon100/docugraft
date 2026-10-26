/**
 * Audio Engine for Vidia SaaS
 * Procedural Web Audio API background music generator + Sound Effects
 * Integrated Web Speech API for unlimited free French & multilingual voiceovers
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingMusic = false;
  private musicInterval: any = null;
  private currentStep = 0;
  private currentTheme: string = 'energetic_trap';
  private masterMusicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterMusicGain = this.ctx.createGain();
      this.masterMusicGain.gain.value = 0.5;
      this.masterMusicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMusicVolume(volume: number) {
    if (this.masterMusicGain) {
      this.masterMusicGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  // Generate punchy procedural drum kick
  private playKick(time: number) {
    if (!this.ctx || !this.masterMusicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35);

    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(time);
    osc.stop(time + 0.35);
  }

  // Generate crisp procedural hi-hat
  private playHiHat(time: number, isAccent = false) {
    if (!this.ctx || !this.masterMusicGain) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = isAccent ? 7000 : 9000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isAccent ? 0.35 : 0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  // Generate melodic synth note / bass
  private playSynthNote(freq: number, time: number, duration: number, type: OscillatorType = 'triangle', filterCutoff = 1200) {
    if (!this.ctx || !this.masterMusicGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterCutoff, time);

    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Start background beat loop
  public startMusic(theme: 'energetic_trap' | 'lofi_chill' | 'luxury_ambient' | 'tech_future' | 'none', volume = 0.5) {
    this.stopMusic();
    if (theme === 'none') return;
    this.initContext();
    this.setMusicVolume(volume);
    this.isPlayingMusic = true;
    this.currentTheme = theme;
    this.currentStep = 0;

    const bpm = theme === 'energetic_trap' ? 130 : theme === 'tech_future' ? 124 : theme === 'lofi_chill' ? 84 : 76;
    const stepDuration = (60 / bpm) / 4; // 16th notes

    // Trap / Bass chord frequencies
    const bassTrap = [55, 55, 65.41, 49]; // A1, C2, G1
    const lofiChords = [220, 261.63, 329.63, 392]; // Am7 / Cmaj
    const luxuryPads = [130.81, 164.81, 196.00, 246.94]; // C-E-G-B
    const techLead = [110, 220, 164.81, 146.83];

    this.musicInterval = setInterval(() => {
      if (!this.isPlayingMusic || !this.ctx) return;
      const now = this.ctx.currentTime;
      const step = this.currentStep % 16;

      if (this.currentTheme === 'energetic_trap') {
        // Kick on 0, 7, 10
        if (step === 0 || step === 7 || step === 10) {
          this.playKick(now);
        }
        // Hihat on even 16ths, roll on 12-15
        if (step % 2 === 0 || step >= 12) {
          this.playHiHat(now, step === 0 || step === 8);
        }
        // 808 sub note on beat 0 and 8
        if (step === 0) {
          const f = bassTrap[Math.floor(this.currentStep / 16) % bassTrap.length];
          this.playSynthNote(f, now, 0.4, 'sawtooth', 400);
        }
      } else if (this.currentTheme === 'lofi_chill') {
        // Mellow kick on 0 and 8
        if (step === 0 || step === 8) {
          this.playKick(now);
        }
        // Soft hi-hat
        if (step % 4 === 2) {
          this.playHiHat(now, false);
        }
        // Warm chord tone
        if (step === 0 || step === 6) {
          const f = lofiChords[Math.floor(this.currentStep / 8) % lofiChords.length];
          this.playSynthNote(f, now, 0.6, 'sine', 800);
        }
      } else if (this.currentTheme === 'luxury_ambient') {
        // Ambient swelling tones
        if (step === 0) {
          const f = luxuryPads[Math.floor(this.currentStep / 16) % luxuryPads.length];
          this.playSynthNote(f, now, 1.2, 'sine', 600);
          this.playSynthNote(f * 1.5, now + 0.1, 1.0, 'triangle', 700);
        }
      } else if (this.currentTheme === 'tech_future') {
        // 4-on-the-floor kick
        if (step % 4 === 0) {
          this.playKick(now);
        }
        // Off-beat open hat
        if (step % 4 === 2) {
          this.playHiHat(now, true);
        }
        // Arpeggiated tech synth
        if (step % 2 === 0) {
          const f = techLead[(step / 2) % techLead.length];
          this.playSynthNote(f * 2, now, 0.18, 'sawtooth', 1400);
        }
      }

      this.currentStep++;
    }, stepDuration * 1000);
  }

  public stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // Sound effects
  public playSoundEffect(type: 'whoosh' | 'pop' | 'chime' | 'shutter') {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    if (type === 'whoosh') {
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.25);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(now);
      noise.stop(now + 0.25);
    } else if (type === 'pop') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'chime') {
      // Golden sales cash chime / bell
      [1200, 1500, 1800, 2400].forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.25, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    } else if (type === 'shutter') {
      // Camera snapshot
      this.playHiHat(now, true);
      setTimeout(() => this.playHiHat(now + 0.08, false), 80);
    }
  }

  // Web Speech API Voiceover integration
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !window.speechSynthesis) return [];
    return window.speechSynthesis.getVoices();
  }

  public speakVoiceover(
    text: string,
    voiceId: string,
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
    onEnd?: () => void
  ) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    this.stopVoiceover();

    if (!text || text.trim().length === 0) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    utterance.pitch = Math.max(0.5, Math.min(1.8, pitch));
    utterance.volume = Math.max(0, Math.min(1.0, volume));

    // Try finding matching voice or fallback to French / English
    const voices = window.speechSynthesis.getVoices();
    if (voiceId) {
      const match = voices.find((v) => v.voiceURI === voiceId || v.name === voiceId);
      if (match) utterance.voice = match;
    }
    if (!utterance.voice) {
      const frenchVoice = voices.find((v) => v.lang.startsWith('fr'));
      if (frenchVoice) utterance.voice = frenchVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stopVoiceover() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }
}

export const audioEngine = new AudioEngine();
