import { InstrumentVariant, KeyInfo } from '../audio/tuning';

export class HarpCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stringEnergy: Float32Array = new Float32Array(96);
  private stringPhase: Float32Array = new Float32Array(96);
  private variant: InstrumentVariant;
  private keys: KeyInfo[];
  private analyser: AnalyserNode | null = null;
  private waveBuf: Float32Array<ArrayBuffer> = new Float32Array(256);
  private rafId = 0;
  private sustainDown = false;

  constructor(canvas: HTMLCanvasElement, variant: InstrumentVariant, keys: KeyInfo[]) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');
    this.ctx = ctx;
    this.variant = variant;
    this.keys = keys;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.start();
  }

  setAnalyser(analyser: AnalyserNode | null): void {
    this.analyser = analyser;
  }

  setSustain(down: boolean): void {
    this.sustainDown = down;
  }

  updateLayout(variant: InstrumentVariant, keys: KeyInfo[]): void {
    this.variant = variant;
    this.keys = keys;
    this.stringEnergy = new Float32Array(keys.length);
    this.stringPhase = new Float32Array(keys.length);
  }

  plucked(keyIndex: number, velocity: number): void {
    if (keyIndex < 0 || keyIndex >= this.stringEnergy.length) return;
    this.stringEnergy[keyIndex] = Math.min(1.0, Math.max(this.stringEnergy[keyIndex], velocity));
    // Visual sympathetic shimmer on octave (+edo) and major 10th (+24 in 18-EDO) when sustain is down
    if (this.sustainDown) {
      const edo = this.variant.edo;
      const sympTargets = [keyIndex + edo, keyIndex - edo];
      if (edo === 18) sympTargets.push(keyIndex + 24);
      if (edo === 12) sympTargets.push(keyIndex + 7, keyIndex + 19);
      for (const t of sympTargets) {
        if (t >= 0 && t < this.stringEnergy.length) {
          this.stringEnergy[t] = Math.max(this.stringEnergy[t], velocity * 0.35);
        }
      }
    }
  }

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(300, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(120, Math.floor(rect.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private start(): void {
    const loop = () => {
      this.draw();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  destroy(): void {
    cancelAnimationFrame(this.rafId);
  }

  private draw(): void {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // 1. Ebony lacquer background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#141210');
    bgGrad.addColorStop(1, '#090807');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const padX = 24;
    const padTop = 14;
    const padBot = 10;
    const innerW = w - padX * 2;
    const innerH = h - padTop - padBot;

    // 2. Alpine Spruce Soundboard (Baby Grand curved bentside or Upright rectangle)
    ctx.save();
    ctx.beginPath();
    if (this.variant.bodyStyle === 'baby-grand') {
      ctx.moveTo(padX, h - padBot);
      ctx.lineTo(padX, padTop + 8);
      ctx.quadraticCurveTo(padX + innerW * 0.16, padTop - 4, padX + innerW * 0.42, padTop + 14);
      ctx.bezierCurveTo(
        padX + innerW * 0.65,
        padTop + 34,
        padX + innerW * 0.78,
        padTop + 70,
        w - padX,
        padTop + 76
      );
      ctx.lineTo(w - padX, h - padBot);
      ctx.closePath();
    } else {
      ctx.roundRect(padX, padTop + 10, innerW, innerH - 10, 8);
    }

    const spruceGrad = ctx.createLinearGradient(padX, padTop, w - padX, h);
    spruceGrad.addColorStop(0, '#784c24');
    spruceGrad.addColorStop(0.45, '#9b6733');
    spruceGrad.addColorStop(0.85, '#7e4f24');
    spruceGrad.addColorStop(1, '#583416');
    ctx.fillStyle = spruceGrad;
    ctx.fill();

    // Subtle spruce wood grain lines
    ctx.clip();
    ctx.strokeStyle = 'rgba(42, 22, 8, 0.22)';
    ctx.lineWidth = 1;
    for (let x = padX - 80; x < w + 80; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x + 90, h);
      ctx.stroke();
    }

    // 3. Cast-iron Gold/Bronze Harp Plate (Arpa Carl Sauter)
    const harpGrad = ctx.createLinearGradient(padX, padTop, w - padX, h);
    harpGrad.addColorStop(0, 'rgba(186, 146, 74, 0.88)');
    harpGrad.addColorStop(0.5, 'rgba(218, 179, 102, 0.78)');
    harpGrad.addColorStop(1, 'rgba(148, 110, 48, 0.85)');

    // Curved Sauter cast-iron struts & frame
    ctx.strokeStyle = harpGrad;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(padX + 16, h - padBot - 6);
    ctx.lineTo(padX + 16, padTop + 18);
    ctx.moveTo(padX + innerW * 0.34, h - padBot - 6);
    ctx.lineTo(padX + innerW * 0.28, padTop + 18);
    ctx.moveTo(padX + innerW * 0.66, h - padBot - 6);
    ctx.lineTo(padX + innerW * 0.64, padTop + 44);
    ctx.stroke();

    // Classic circular cast-iron soundholes
    ctx.fillStyle = 'rgba(48, 28, 12, 0.65)';
    ctx.strokeStyle = 'rgba(235, 198, 124, 0.75)';
    ctx.lineWidth = 2.5;
    const holes = [
      [padX + innerW * 0.14, padTop + 46, 15],
      [padX + innerW * 0.24, padTop + 62, 13],
      [padX + innerW * 0.45, padTop + 56, 14],
    ];
    for (const [hx, hy, hr] of holes) {
      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Wooden bridge curve
    ctx.strokeStyle = '#3b2210';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(padX + 26, padTop + 42);
    ctx.quadraticCurveTo(padX + innerW * 0.45, padTop + 90, w - padX - 18, padTop + 112);
    ctx.stroke();

    // 4. Vibrating Strings (Copper-wound bass + Steel treble)
    const n = this.keys.length;
    const decayRate = this.sustainDown ? 0.985 : 0.945;

    for (let i = 0; i < n; i++) {
      const frac = i / Math.max(1, n - 1);
      const xBottom = padX + 12 + frac * (innerW - 24);
      // Slight fan/overstringing angle like a real baby grand
      const isBass = i < Math.floor(n * 0.28);
      const xTop = isBass
        ? xBottom + innerW * 0.08
        : xBottom - innerW * 0.02;
      const yTop = padTop + (this.variant.bodyStyle === 'baby-grand' ? 12 + frac * 68 : 16);
      const yBottom = h - padBot - 4;

      const energy = this.stringEnergy[i];
      if (energy > 0.005) {
        this.stringPhase[i] += 0.55 + frac * 0.45;
        this.stringEnergy[i] *= decayRate;
      } else {
        this.stringEnergy[i] = 0;
      }

      const disp = energy * 3.8 * Math.sin(this.stringPhase[i]);

      ctx.beginPath();
      ctx.moveTo(xBottom, yBottom);
      if (energy > 0.01) {
        const midX = (xBottom + xTop) * 0.5 + disp;
        const midY = (yBottom + yTop) * 0.5;
        ctx.quadraticCurveTo(midX, midY, xTop, yTop);
        ctx.strokeStyle = isBass
          ? `rgba(246, 178, 107, ${0.65 + energy * 0.35})`
          : `rgba(255, 232, 168, ${0.65 + energy * 0.35})`;
        ctx.lineWidth = isBass ? 2.1 : 1.5;
      } else {
        ctx.lineTo(xTop, yTop);
        ctx.strokeStyle = isBass
          ? 'rgba(196, 122, 68, 0.52)'
          : 'rgba(218, 212, 200, 0.32)';
        ctx.lineWidth = isBass ? 1.3 : 0.85;
      }
      ctx.stroke();
    }

    // Red felt damper rail along bottom of harp
    ctx.fillStyle = '#7d171d';
    ctx.fillRect(padX, h - padBot - 8, innerW, 6);

    ctx.restore();

    // 5. Outer polished rim border
    ctx.strokeStyle = 'rgba(212, 175, 106, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (this.variant.bodyStyle === 'baby-grand') {
      ctx.moveTo(padX, h - padBot);
      ctx.lineTo(padX, padTop + 8);
      ctx.quadraticCurveTo(padX + innerW * 0.16, padTop - 4, padX + innerW * 0.42, padTop + 14);
      ctx.bezierCurveTo(
        padX + innerW * 0.65,
        padTop + 34,
        padX + innerW * 0.78,
        padTop + 70,
        w - padX,
        padTop + 76
      );
      ctx.lineTo(w - padX, h - padBot);
    } else {
      ctx.roundRect(padX, padTop + 10, innerW, innerH - 10, 8);
    }
    ctx.stroke();

    // 6. Subtle real-time acoustic waveform in upper-right lacquer area
    if (this.analyser) {
      this.analyser.getFloatTimeDomainData(this.waveBuf);
      const ox = w - 210;
      const oy = 32;
      const ow = 180;
      const oh = 28;
      ctx.strokeStyle = 'rgba(242, 210, 139, 0.65)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let i = 0; i < this.waveBuf.length; i += 2) {
        const px = ox + (i / this.waveBuf.length) * ow;
        const py = oy + this.waveBuf[i] * oh * 1.4;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }
}
