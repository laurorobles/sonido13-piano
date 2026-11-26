// Hybrid Physical Modeling Piano AudioWorkletProcessor
// Modal string bank (inharmonicity B + 2-stage unison beating) +
// Nonlinear Stulov-inspired hammer exciter + 18-EDO sympathetic resonance +
// 4-channel Hadamard FDN spruce soundboard.

const MAX_VOICES = 28;
const MAX_MODES = 10;

class Sonido13PianoProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.sr = sampleRate;
    this.voices = [];
    for (let i = 0; i < MAX_VOICES; i++) {
      this.voices.push({
        active: false,
        keyIndex: -1,
        freq: 261.63,
        B: 0.00035,
        velocity: 0,
        held: false,
        sustained: false,
        age: 0,
        pan: 0,
        numModes: 0,
        // Per-mode 2nd-order damped resonator state (direct-form / coupled rotation)
        cosW: new Float32Array(MAX_MODES),
        sinW: new Float32Array(MAX_MODES),
        r: new Float32Array(MAX_MODES),
        rDamp: new Float32Array(MAX_MODES),
        re: new Float32Array(MAX_MODES),
        im: new Float32Array(MAX_MODES),
        amp: new Float32Array(MAX_MODES),
        // Second unison string detuned slightly for 2-stage decay
        cosW2: new Float32Array(MAX_MODES),
        sinW2: new Float32Array(MAX_MODES),
        re2: new Float32Array(MAX_MODES),
        im2: new Float32Array(MAX_MODES),
        // Hammer transient
        hammerEnv: 0,
        hammerDecay: 0.992,
        hammerBright: 0.5,
      });
    }

    // Physical parameters (adjustable from UI)
    this.params = {
      hammerHardness: 0.55,    // 0.1..1.0
      unisonWidth: 0.35,       // 0.0..1.0 (kept tight for 18-EDO clarity)
      sympathetic: 0.55,       // 0.0..1.0
      inharmonicityScale: 1.0, // 0.0..2.0
      soundboardMix: 0.42,     // 0.0..1.0
      masterGain: 0.72,
      edo: 18,
    };

    this.sustainPedal = false;
    this.unaCorda = false;

    // 4-channel Hadamard FDN for spruce soundboard radiation
    const dLens = [
      Math.floor(0.0113 * this.sr),
      Math.floor(0.0149 * this.sr),
      Math.floor(0.0197 * this.sr),
      Math.floor(0.0251 * this.sr),
    ];
    this.fdnBuf = dLens.map((len) => new Float32Array(len));
    this.fdnIdx = [0, 0, 0, 0];
    this.fdnLp = [0, 0, 0, 0];

    // Sympathetic resonance bus (accumulates bridge energy)
    this.bridgeEnergy = 0;

    this.port.onmessage = (e) => {
      const msg = e.data;
      if (!msg) return;
      if (msg.type === 'noteOn') {
        this.triggerNote(msg.keyIndex, msg.freq, msg.B, msg.velocity, msg.pan);
      } else if (msg.type === 'noteOff') {
        this.releaseNote(msg.keyIndex);
      } else if (msg.type === 'sustain') {
        this.setSustain(msg.value);
      } else if (msg.type === 'unaCorda') {
        this.unaCorda = !!msg.value;
      } else if (msg.type === 'param') {
        if (msg.name in this.params) {
          this.params[msg.name] = msg.value;
        }
      } else if (msg.type === 'allNotesOff') {
        for (let i = 0; i < MAX_VOICES; i++) {
          this.voices[i].active = false;
          this.voices[i].held = false;
          this.voices[i].sustained = false;
        }
      }
    };
  }

  triggerNote(keyIndex, freq, B, velocity, pan) {
    // Reuse existing voice for same key, or find free/oldest voice
    let voice = this.voices.find((v) => v.active && v.keyIndex === keyIndex);
    if (!voice) {
      voice = this.voices.find((v) => !v.active);
    }
    if (!voice) {
      let oldest = this.voices[0];
      for (let i = 1; i < MAX_VOICES; i++) {
        if (this.voices[i].age > oldest.age) oldest = this.voices[i];
      }
      voice = oldest;
    }

    const vel = Math.max(0.05, Math.min(1.0, velocity));
    const effVel = this.unaCorda ? vel * 0.72 : vel;
    const effB = B * this.params.inharmonicityScale;
    const nyquist = this.sr * 0.44;

    voice.active = true;
    voice.keyIndex = keyIndex;
    voice.freq = freq;
    voice.B = effB;
    voice.velocity = effVel;
    voice.held = true;
    voice.sustained = false;
    voice.age = 0;
    voice.pan = pan;

    // Nonlinear Stulov hammer brightness: harder felt & higher velocity excite more upper partials
    const hardness = this.params.hammerHardness * (this.unaCorda ? 0.75 : 1.0);
    const brightExp = 2.4 - 1.35 * (0.45 * hardness + 0.55 * effVel);

    // Unison detuning in cents (tighter in upper register for 18-EDO clarity)
    const regFactor = Math.max(0.35, Math.min(1.2, 320 / Math.max(80, freq)));
    const unisonCents = this.params.unisonWidth * 1.65 * regFactor;
    const detuneRatio = Math.pow(2, unisonCents / 1200);

    // Strike point ~1/7.5 of string length (suppresses 7th/8th partial slightly like a real grand)
    const strikePos = 1 / 7.5;

    let modeCount = 0;
    for (let n = 1; n <= MAX_MODES; n++) {
      const fn = n * freq * Math.sqrt(1 + effB * n * n);
      if (fn >= nyquist) break;

      const w = (2 * Math.PI * fn) / this.sr;
      const w2 = (2 * Math.PI * fn * detuneRatio) / this.sr;

      voice.cosW[modeCount] = Math.cos(w);
      voice.sinW[modeCount] = Math.sin(w);
      voice.cosW2[modeCount] = Math.cos(w2);
      voice.sinW2[modeCount] = Math.sin(w2);

      // Realistic partial decay: bass strings ring longer, high partials decay faster
      const baseT60 = Math.max(0.45, Math.min(8.5, 4.6 * Math.pow(261.63 / Math.max(40, freq), 0.52)));
      const partialT60 = baseT60 / Math.pow(n, 0.85);
      voice.r[modeCount] = Math.exp(-6.907755 / (partialT60 * this.sr));

      // Damper decay (fast, ~60-110ms)
      const dampT60 = Math.max(0.05, Math.min(0.16, 0.11 * Math.pow(261.63 / Math.max(40, freq), 0.25)));
      voice.rDamp[modeCount] = Math.exp(-6.907755 / (dampT60 * this.sr));

      // Strike position comb + nonlinear hammer rolloff
      const strikeGain = Math.abs(Math.sin(Math.PI * n * strikePos));
      const amp = (effVel * (0.28 + 0.72 * strikeGain)) / Math.pow(n, Math.max(0.65, brightExp));

      voice.amp[modeCount] = amp;
      voice.re[modeCount] = amp;
      voice.im[modeCount] = 0;
      voice.re2[modeCount] = amp * 0.65;
      voice.im2[modeCount] = 0;

      modeCount++;
    }
    voice.numModes = modeCount;

    // Short felt-on-string impact transient
    voice.hammerEnv = effVel * (0.14 + 0.22 * hardness);
    voice.hammerDecay = Math.exp(-1 / (0.0045 * this.sr));
    voice.hammerBright = hardness;

    // Sympathetic excitation of already-ringing voices (authentic EDO intervals!)
    if (this.params.sympathetic > 0.01) {
      this.exciteSympathetic(freq, effVel * this.params.sympathetic);
    }
  }

  exciteSympathetic(srcFreq, amount) {
    const edo = this.params.edo;
    for (let i = 0; i < MAX_VOICES; i++) {
      const v = this.voices[i];
      if (!v.active || (!v.held && !v.sustained)) continue;
      // Check if srcFreq and v.freq share a close partial (within ±15 cents)
      const ratio = v.freq / srcFreq;
      const semiRatio = Math.log2(ratio);
      const steps = Math.round(semiRatio * edo);
      const absSteps = Math.abs(steps);
      if (absSteps === 0) continue;

      // Exact octave (+edo, +2*edo) always resonates strongly
      let coupling = 0;
      if (absSteps === edo || absSteps === edo * 2) {
        coupling = 0.045;
      } else if (edo === 18 && (absSteps === 24 || absSteps === 6)) {
        // 18-EDO major tenth (+24 steps) and major third (+6 steps)
        coupling = 0.022;
      } else if (edo === 12 && (absSteps === 7 || absSteps === 5 || absSteps === 19)) {
        // 12-EDO fifths and fourths (explicitly absent in 18-EDO!)
        coupling = 0.036;
      }

      if (coupling > 0 && v.numModes > 0) {
        const exc = amount * coupling;
        v.re[0] += exc;
        if (v.numModes > 1) v.re[1] += exc * 0.6;
      }
    }
  }

  releaseNote(keyIndex) {
    for (let i = 0; i < MAX_VOICES; i++) {
      const v = this.voices[i];
      if (v.active && v.keyIndex === keyIndex && v.held) {
        v.held = false;
        if (this.sustainPedal) {
          v.sustained = true;
        }
      }
    }
  }

  setSustain(isDown) {
    this.sustainPedal = !!isDown;
    if (!this.sustainPedal) {
      for (let i = 0; i < MAX_VOICES; i++) {
        if (this.voices[i].sustained) {
          this.voices[i].sustained = false;
        }
      }
    }
  }

  process(_inputs, outputs) {
    const out = outputs[0];
    if (!out || out.length < 2) return true;
    const outL = out[0];
    const outR = out[1];
    const blockLen = outL.length;

    const sbMix = this.params.soundboardMix;
    const master = this.params.masterGain;
    const fdnFb = 0.44 + 0.14 * sbMix;

    for (let s = 0; s < blockLen; s++) {
      let sumL = 0;
      let sumR = 0;

      for (let i = 0; i < MAX_VOICES; i++) {
        const v = this.voices[i];
        if (!v.active) continue;
        v.age++;

        const isDamping = !v.held && !v.sustained;
        let voiceOut = 0;
        let maxAmp = 0;

        for (let m = 0; m < v.numModes; m++) {
          const decay = isDamping ? v.rDamp[m] : v.r[m];

          // String 1
          const re1 = v.re[m];
          const im1 = v.im[m];
          const nRe1 = (re1 * v.cosW[m] - im1 * v.sinW[m]) * decay;
          const nIm1 = (re1 * v.sinW[m] + im1 * v.cosW[m]) * decay;
          v.re[m] = nRe1;
          v.im[m] = nIm1;

          // String 2 (unison chorus)
          const re2 = v.re2[m];
          const im2 = v.im2[m];
          const nRe2 = (re2 * v.cosW2[m] - im2 * v.sinW2[m]) * decay;
          const nIm2 = (re2 * v.sinW2[m] + im2 * v.cosW2[m]) * decay;
          v.re2[m] = nRe2;
          v.im2[m] = nIm2;

          voiceOut += nRe1 + nRe2 * 0.55;
          const a = Math.abs(nRe1);
          if (a > maxAmp) maxAmp = a;
        }

        // Hammer felt impact transient
        if (v.hammerEnv > 1e-5) {
          const noise = (Math.random() * 2 - 1) * v.hammerEnv;
          voiceOut += noise * 0.35;
          v.hammerEnv *= v.hammerDecay;
        }

        if (maxAmp < 1e-5 && v.hammerEnv < 1e-5) {
          v.active = false;
          continue;
        }

        // Stereo placement across keyboard (bass left, treble right)
        const panL = Math.cos((v.pan + 1) * 0.25 * Math.PI);
        const panR = Math.sin((v.pan + 1) * 0.25 * Math.PI);
        sumL += voiceOut * panL;
        sumR += voiceOut * panR;
      }

      // 4-channel Hadamard FDN spruce soundboard
      const monoIn = (sumL + sumR) * 0.35;
      const d0 = this.fdnBuf[0][this.fdnIdx[0]];
      const d1 = this.fdnBuf[1][this.fdnIdx[1]];
      const d2 = this.fdnBuf[2][this.fdnIdx[2]];
      const d3 = this.fdnBuf[3][this.fdnIdx[3]];

      // Spruce absorption lowpass
      this.fdnLp[0] += 0.32 * (d0 - this.fdnLp[0]);
      this.fdnLp[1] += 0.29 * (d1 - this.fdnLp[1]);
      this.fdnLp[2] += 0.26 * (d2 - this.fdnLp[2]);
      this.fdnLp[3] += 0.23 * (d3 - this.fdnLp[3]);

      const l0 = this.fdnLp[0];
      const l1 = this.fdnLp[1];
      const l2 = this.fdnLp[2];
      const l3 = this.fdnLp[3];

      // Normalized Hadamard matrix (0.5 * H4)
      const h0 = 0.5 * (l0 + l1 + l2 + l3);
      const h1 = 0.5 * (l0 - l1 + l2 - l3);
      const h2 = 0.5 * (l0 + l1 - l2 - l3);
      const h3 = 0.5 * (l0 - l1 - l2 + l3);

      this.fdnBuf[0][this.fdnIdx[0]] = monoIn + h0 * fdnFb;
      this.fdnBuf[1][this.fdnIdx[1]] = monoIn + h1 * fdnFb;
      this.fdnBuf[2][this.fdnIdx[2]] = monoIn + h2 * fdnFb;
      this.fdnBuf[3][this.fdnIdx[3]] = monoIn + h3 * fdnFb;

      for (let c = 0; c < 4; c++) {
        this.fdnIdx[c]++;
        if (this.fdnIdx[c] >= this.fdnBuf[c].length) this.fdnIdx[c] = 0;
      }

      const sbL = (l0 + l2) * 0.45;
      const sbR = (l1 + l3) * 0.45;

      // Soft limiter for polyphonic warmth
      const rawL = (sumL * (1 - sbMix * 0.35) + sbL * sbMix) * master;
      const rawR = (sumR * (1 - sbMix * 0.35) + sbR * sbMix) * master;
      outL[s] = Math.tanh(rawL);
      outR[s] = Math.tanh(rawR);
    }

    return true;
  }
}

registerProcessor('sonido13-piano-processor', Sonido13PianoProcessor);
