import { KeyInfo } from './tuning';

export interface PianoParams {
  hammerHardness: number;
  unisonWidth: number;
  sympathetic: number;
  inharmonicityScale: number;
  soundboardMix: number;
  masterGain: number;
  edo: number;
}

export class PianoEngine {
  private ctx: AudioContext | null = null;
  private worklet: AudioWorkletNode | null = null;
  private analyser: AnalyserNode | null = null;
  private ready = false;
  private initPromise: Promise<void> | null = null;
  private pendingParams: Partial<PianoParams> = {};
  private midiAccess: MIDIAccess | null = null;
  private onMidiNoteCallback: ((keyIndex: number, velocity: number, isOn: boolean) => void) | null = null;
  private onMidiSustainCallback: ((down: boolean) => void) | null = null;

  async init(): Promise<void> {
    if (this.ready && this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      this.ctx = new AudioContext({ latencyHint: 'interactive' });
      const workletUrl = `${import.meta.env.BASE_URL}piano-worklet.js`;
      await this.ctx.audioWorklet.addModule(workletUrl);

      this.worklet = new AudioWorkletNode(this.ctx, 'sonido13-piano-processor', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
      });

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.8;

      this.worklet.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.ready = true;

      for (const [name, value] of Object.entries(this.pendingParams)) {
        this.setParam(name as keyof PianoParams, value as number);
      }
      this.pendingParams = {};
    })();

    return this.initPromise;
  }

  isReady(): boolean {
    return this.ready;
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  async noteOn(key: KeyInfo, totalKeys: number, velocity = 0.78): Promise<void> {
    if (!this.ready) {
      await this.init();
    } else if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (!this.worklet) return;
    const pan = (key.index / Math.max(1, totalKeys - 1)) * 1.4 - 0.7;
    this.worklet.port.postMessage({
      type: 'noteOn',
      keyIndex: key.index,
      freq: key.freqHz,
      B: key.inharmonicityB,
      velocity,
      pan,
    });
  }

  noteOff(keyIndex: number): void {
    if (!this.worklet) return;
    this.worklet.port.postMessage({ type: 'noteOff', keyIndex });
  }

  setSustain(down: boolean): void {
    if (!this.worklet) return;
    this.worklet.port.postMessage({ type: 'sustain', value: down });
  }

  setUnaCorda(down: boolean): void {
    if (!this.worklet) return;
    this.worklet.port.postMessage({ type: 'unaCorda', value: down });
  }

  setParam<K extends keyof PianoParams>(name: K, value: PianoParams[K]): void {
    if (!this.worklet) {
      this.pendingParams[name] = value;
      return;
    }
    this.worklet.port.postMessage({ type: 'param', name, value });
  }

  allNotesOff(): void {
    if (!this.worklet) return;
    this.worklet.port.postMessage({ type: 'allNotesOff' });
  }

  async enableMidi(
    onNote: (keyIndex: number, velocity: number, isOn: boolean) => void,
    onSustain: (down: boolean) => void
  ): Promise<{ supported: boolean; devices: string[] }> {
    this.onMidiNoteCallback = onNote;
    this.onMidiSustainCallback = onSustain;

    if (!navigator.requestMIDIAccess) {
      return { supported: false, devices: [] };
    }
    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      const devices: string[] = [];
      this.midiAccess.inputs.forEach((input) => {
        devices.push(input.name || 'MIDI Device');
        input.onmidimessage = (e) => this.handleMidiMessage(e);
      });
      return { supported: true, devices };
    } catch {
      return { supported: false, devices: [] };
    }
  }

  private handleMidiMessage(event: MIDIMessageEvent): void {
    const data = event.data;
    if (!data || data.length < 2) return;
    const status = data[0] & 0xf0;
    const d1 = data[1];
    const d2 = data.length > 2 ? data[2] : 0;

    if (status === 0x90 && d2 > 0) {
      // Note On: map MIDI 21 (A0) -> index 0
      const keyIndex = d1 - 21;
      this.onMidiNoteCallback?.(keyIndex, d2 / 127, true);
    } else if (status === 0x80 || (status === 0x90 && d2 === 0)) {
      const keyIndex = d1 - 21;
      this.onMidiNoteCallback?.(keyIndex, 0, false);
    } else if (status === 0xb0 && d1 === 64) {
      // Sustain pedal CC64
      this.onMidiSustainCallback?.(d2 >= 64);
    }
  }
}
