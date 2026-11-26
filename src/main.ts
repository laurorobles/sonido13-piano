import './styles.css';
import {
  ANCHOR_PRESETS,
  AnchorId,
  KeyInfo,
  VARIANTS,
  VariantId,
  buildKeyboardLayout,
  generateScalaKbm,
  generateScalaScl,
} from './audio/tuning';
import { PianoEngine } from './audio/pianoEngine';
import { PIANOLA_PIECES, PianolaPiece } from './data/pianolaPieces';
import { GUIDE_HTML, Lang, RESEARCH_HTML, UI_TEXT } from './data/i18n';
import { HarpCanvas } from './ui/harpCanvas';

// Application State
let lang: Lang = 'es';
let currentVariant: VariantId = 'tercios';
let savedMicrotonalVariant: VariantId = 'tercios';
let currentAnchor: AnchorId = 'c4-40';
let railsbackStretch = 1.0;
let showCarrilloNumbers = true;
let showQwertyHints = true;
let showPieceDossier = true;
let autoSwitchPieceVariant = true;
let keyboardZoom = 1.0;
let qwertyBaseIndex = 39; // C4 on 88-key board; Z/X shifts by ±12 keys
let sustainDown = false;
let unaCordaDown = false;
let midiConnected = false;

// Persist slider values across re-renders so UI state stays 100% consistent
const uiParams = {
  hammerHardness: 0.55,
  unisonWidth: 0.35,
  sympathetic: 0.55,
  inharmonicityScale: 1.0,
  soundboardMix: 0.42,
  masterGain: 0.72,
};

let keys: KeyInfo[] = buildKeyboardLayout(currentVariant, currentAnchor, railsbackStretch, lang);
const activeKeys = new Set<number>();
let lastPlayedKey: KeyInfo | null = null;
let prevPlayedKey: KeyInfo | null = null;

// Pianola state
let selectedPieceId = PIANOLA_PIECES[0].id;
let pianolaPlaying = false;
let pianolaTime = 0;
let pianolaTempo = 1.0;
let pianolaRaf = 0;
let pianolaLastTs = 0;
let currentLiveCallout = '';
let triggeredEvents = new Set<number>();
let scheduledOffs = new Map<number, number>();

const engine = new PianoEngine();
let harp: HarpCanvas | null = null;
let rollRaf = 0;

// Computer keyboard offsets relative to qwertyBaseIndex (0..17)
const QWERTY_OFFSETS: Array<[string, number, string]> = [
  ['a', 0, 'A'],
  ['w', 1, 'W'],
  ['s', 2, 'S'],
  ['e', 3, 'E'],
  ['d', 4, 'D'],
  ['f', 5, 'F'],
  ['t', 6, 'T'],
  ['g', 7, 'G'],
  ['y', 8, 'Y'],
  ['h', 9, 'H'],
  ['u', 10, 'U'],
  ['j', 11, 'J'],
  ['k', 12, 'K'],
  ['o', 13, 'O'],
  ['l', 14, 'L'],
  ['p', 15, 'P'],
  ['ñ', 16, 'Ñ'],
  [';', 16, ';'],
  ["'", 17, "'"],
];
const heldQwerty = new Map<string, number>();

function t() {
  return UI_TEXT[lang];
}

function setText(id: string, val: string): void {
  const el = document.getElementById(id);
  if (el && el.textContent !== val) el.textContent = val;
}

function downloadFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function describe12EdoInterval(semitones: number): string {
  const abs = Math.abs(semitones);
  const namesEs = [
    'Unísono (0¢)',
    '2ª menor (100¢)',
    '2ª mayor (200¢)',
    '3ª menor (300¢)',
    '3ª mayor (400¢)',
    '4ª justa (500¢)',
    'Tritono (600¢)',
    '5ª justa (700¢)',
    '6ª menor (800¢)',
    '6ª mayor (900¢)',
    '7ª menor (1000¢)',
    '7ª mayor (1100¢)',
    'Octava (1200¢)',
  ];
  const namesEn = [
    'Unison (0¢)',
    'Minor 2nd (100¢)',
    'Major 2nd (200¢)',
    'Minor 3rd (300¢)',
    'Major 3rd (400¢)',
    'Perfect 4th (500¢)',
    'Tritone (600¢)',
    'Perfect 5th (700¢)',
    'Minor 6th (800¢)',
    'Major 6th (900¢)',
    'Minor 7th (1000¢)',
    'Major 7th (1100¢)',
    'Octave (1200¢)',
  ];
  const list = lang === 'es' ? namesEs : namesEn;
  if (abs <= 12) return list[abs];
  const octs = Math.floor(abs / 12);
  const rem = abs % 12;
  return `${octs} oct + ${list[rem]}`;
}

function describeSoundingInterval(cents: number, edo: number, steps: number): string {
  const absSteps = Math.abs(steps);
  const c = Math.abs(cents);
  if (absSteps === 0) return lang === 'es' ? 'Misma nota' : 'Same note';
  if (absSteps === edo) return lang === 'es' ? '¡Octava completa! (doble aguda)' : 'Full octave! (twice as high)';
  if (absSteps === edo * 2) return lang === 'es' ? 'Dos octavas completas' : 'Two full octaves';
  if (edo === 18) {
    if (absSteps === 1) return lang === 'es' ? '1 tercio de tono (pasito corto)' : '1 third-tone (tiny step)';
    if (absSteps === 2) return lang === 'es' ? '2 tercios de tono' : '2 third-tones';
    if (absSteps === 3) return lang === 'es' ? '1 tono entero exacto' : '1 exact whole step';
    if (absSteps === 5) return lang === 'es' ? 'Tercera neutra (ni alegre ni triste)' : 'Neutral 3rd (neither happy/sad)';
    if (absSteps === 6) return lang === 'es' ? 'Tercera mayor (brillante)' : 'Major 3rd (bright)';
    if (absSteps === 7) return lang === 'es' ? 'Cuarta suave (un pelito baja)' : 'Soft fourth (slightly low)';
    if (absSteps === 8) return lang === 'es' ? 'Nota armónica especial (11:8)' : 'Special harmonic note (11:8)';
    if (absSteps === 9) return lang === 'es' ? 'Media octava exacta' : 'Exact half-octave';
    if (absSteps === 11) return lang === 'es' ? 'Quinta abierta (un pelito alta)' : 'Open fifth (slightly wide)';
    if (absSteps === 12) return lang === 'es' ? 'Solo 2/3 de octava (aún falta)' : 'Only 2/3 of an octave';
  }
  return lang === 'es' ? `${Math.round(c)} cents de distancia` : `${Math.round(c)} cents apart`;
}

function triggerNoteOn(keyIndex: number, velocity = 0.78): void {
  if (keyIndex < 0 || keyIndex >= keys.length) return;
  const key = keys[keyIndex];
  if (lastPlayedKey && lastPlayedKey.index !== keyIndex) {
    prevPlayedKey = lastPlayedKey;
  }
  activeKeys.add(keyIndex);
  lastPlayedKey = key;

  engine.noteOn(key, keys.length, velocity).then(() => {
    if (harp && engine.getAnalyser()) {
      harp.setAnalyser(engine.getAnalyser());
    }
  });
  harp?.plucked(keyIndex, velocity);
  updateKeyVisual(keyIndex, true);
  updateNotationHud();
  updateMetamorphosisBox();
  updatePitchCircle();
}

function triggerNoteOff(keyIndex: number): void {
  if (keyIndex < 0 || keyIndex >= keys.length) return;
  activeKeys.delete(keyIndex);
  engine.noteOff(keyIndex);
  updateKeyVisual(keyIndex, false);
  updatePitchCircle();
}

function setSustain(down: boolean): void {
  sustainDown = down;
  engine.setSustain(down);
  harp?.setSustain(down);
  document.getElementById('pedal-sustain')?.classList.toggle('active', down);
}

function setUnaCorda(down: boolean): void {
  unaCordaDown = down;
  engine.setUnaCorda(down);
  document.getElementById('pedal-unacorda')?.classList.toggle('active', down);
}

function updateKeyVisual(keyIndex: number, isActive: boolean): void {
  const el = document.querySelector(`[data-key-index="${keyIndex}"]`);
  if (el) el.classList.toggle('active', isActive);
}

// Updates ONLY textContent inside the pre-built 6-column HUD — ZERO DOM reflow / size change!
function updateNotationHud(): void {
  const v = VARIANTS[currentVariant];
  setText('hud-k-step', `Carrillo (0–${v.edo - 1})`);
  setText('hud-k-90', v.edo === 18 ? t().scale90Label : lang === 'es' ? 'Paso EDO' : 'EDO Step');

  if (!lastPlayedKey) {
    setText('hud-v-step', '—');
    setText('hud-v-90', v.edo === 18 ? '—' : `${v.stepCents.toFixed(1)}¢`);
    setText('hud-v-freq', '— Hz');
    setText('hud-v-12', '—');
    setText('hud-v-b', '—');
    setText('hud-v-key', '—');
    return;
  }

  const k = lastPlayedKey;
  const centsStr =
    k.centsFromNearest12 === 0
      ? '0¢'
      : k.centsFromNearest12 > 0
        ? `+${k.centsFromNearest12}¢`
        : `${k.centsFromNearest12}¢`;

  setText('hud-v-step', `${k.carrilloStep} · oct ${k.carrilloOctave}`);
  setText('hud-v-90', k.carrillo90 !== null ? String(k.carrillo90) : `${v.stepCents.toFixed(1)}¢`);
  setText('hud-v-freq', `${k.freqHz.toFixed(2)} Hz`);
  setText('hud-v-12', `${k.nearest12Name} (${centsStr})`);
  setText('hud-v-b', k.inharmonicityB.toFixed(5));
  setText('hud-v-key', `#${k.keyNumber} (${k.visualName})`);
}

// Updates ONLY textContent inside the pre-built 3-column Metamorphosis grid — ZERO size change!
function updateMetamorphosisBox(): void {
  const v = VARIANTS[currentVariant];
  setText('meta-k-here', `${t().eduSoundingHere} (${v.edo}-EDO)`);

  let kA: KeyInfo | null = null;
  let kB: KeyInfo | null = null;
  if (activeKeys.size >= 2) {
    const sorted = Array.from(activeKeys).sort((a, b) => a - b);
    kA = keys[sorted[0]];
    kB = keys[sorted[sorted.length - 1]];
  } else if (prevPlayedKey && lastPlayedKey && prevPlayedKey.index !== lastPlayedKey.index) {
    kA = prevPlayedKey;
    kB = lastPlayedKey;
  }

  if (!kA || !kB) {
    setText('meta-v-span', '—');
    setText('meta-v-12', lang === 'es' ? 'Toca 2 teclas o acorde' : 'Play 2 keys or chord');
    setText('meta-v-here', '—');
    return;
  }

  const diffKeys = kB.index - kA.index;
  const sign = diffKeys > 0 ? '+' : '';
  const centsReal = 1200 * Math.log2(kB.freqHz / kA.freqHz);

  setText('meta-v-span', `${sign}${diffKeys} (${kA.keyNumber}→${kB.keyNumber})`);
  setText('meta-v-12', describe12EdoInterval(diffKeys));
  setText('meta-v-here', describeSoundingInterval(centsReal, v.edo, diffKeys));
}

function updatePitchCircle(): void {
  const svg = document.getElementById('pitch-circle-svg');
  if (!svg) return;
  const v = VARIANTS[currentVariant];
  const edo = v.edo;
  const cx = 41;
  const cy = 41;
  const r = 33;

  const activeSteps = new Set<number>();
  activeKeys.forEach((idx) => {
    if (keys[idx]) activeSteps.add(keys[idx].carrilloStep);
  });
  if (activeSteps.size === 0 && lastPlayedKey) {
    activeSteps.add(lastPlayedKey.carrilloStep);
  }

  const parts: string[] = [];
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#0e0c0a" stroke="rgba(212,175,106,0.32)" stroke-width="1.5" />`);

  if (activeSteps.size >= 2) {
    const sorted = Array.from(activeSteps).sort((a, b) => a - b);
    const pts = sorted
      .map((s) => {
        const ang = (s / edo) * Math.PI * 2 - Math.PI / 2;
        return `${(cx + r * Math.cos(ang)).toFixed(1)},${(cy + r * Math.sin(ang)).toFixed(1)}`;
      })
      .join(' ');
    parts.push(`<polygon points="${pts}" fill="rgba(212,175,106,0.2)" stroke="#f2d28b" stroke-width="1.5" />`);
  }

  const tickCount = edo > 36 ? 24 : edo;
  for (let i = 0; i < tickCount; i++) {
    const stepVal = edo > 36 ? i * 4 : i;
    const ang = (i / tickCount) * Math.PI * 2 - Math.PI / 2;
    const px = cx + r * Math.cos(ang);
    const py = cy + r * Math.sin(ang);
    const isZero = i === 0;
    const isHit = activeSteps.has(stepVal);
    const dotR = isHit ? 4.0 : isZero ? 3.0 : 1.7;
    const fill = isHit ? '#f2d28b' : isZero ? '#c87b4b' : 'rgba(212,175,106,0.45)';
    parts.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${dotR}" fill="${fill}" />`);
  }

  parts.push(
    `<text x="${cx}" y="${cy + 3.5}" text-anchor="middle" fill="#a59a88" font-family="JetBrains Mono,monospace" font-size="8.5">${edo}-EDO</text>`
  );

  svg.innerHTML = parts.join('');
}

// Falling-note Pianola Roll renderer
function startRollLoop(): void {
  cancelAnimationFrame(rollRaf);
  const drawRoll = () => {
    const canvas = document.getElementById('roll-canvas') as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
          canvas.width = Math.max(200, Math.floor(w * dpr));
          canvas.height = Math.max(30, Math.floor(h * dpr));
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        ctx.clearRect(0, 0, w, h);

        const whiteKeys = keys.filter((k) => !k.isBlack);
        const whiteW = w / Math.max(1, whiteKeys.length);
        const keyXCenter = new Float32Array(keys.length);
        let wCounter = 0;
        for (let i = 0; i < keys.length; i++) {
          if (!keys[i].isBlack) {
            keyXCenter[i] = (wCounter + 0.5) * whiteW;
            wCounter++;
          } else {
            keyXCenter[i] = wCounter * whiteW;
          }
          if (keys[i].carrilloStep === 0) {
            ctx.strokeStyle = 'rgba(212, 175, 106, 0.2)';
            ctx.beginPath();
            ctx.moveTo(keyXCenter[i], 0);
            ctx.lineTo(keyXCenter[i], h);
            ctx.stroke();
          }
        }

        const piece = getSelectedPiece();
        const lookahead = 2.6;
        for (const ev of piece.events) {
          const kIdx = Math.min(keys.length - 1, Math.max(0, ev.keyIndex));
          const dtStart = ev.timeSec - pianolaTime;
          const dtEnd = ev.timeSec + ev.durationSec - pianolaTime;
          if (dtEnd < 0 || dtStart > lookahead) continue;

          const yBottom = h * (1 - Math.max(0, dtStart) / lookahead);
          const yTop = h * (1 - Math.min(lookahead, dtEnd) / lookahead);
          const barH = Math.max(4, yBottom - yTop);
          const barW = Math.max(4, keys[kIdx].isBlack ? whiteW * 0.56 : whiteW * 0.78);
          const bx = keyXCenter[kIdx] - barW / 2;

          const isNow = dtStart <= 0 && dtEnd >= 0;
          ctx.fillStyle = isNow ? '#f2d28b' : keys[kIdx].carrilloStep === 0 ? '#d88b4b' : 'rgba(212, 175, 106, 0.68)';
          ctx.beginPath();
          ctx.roundRect(bx, yTop, barW, barH, 2);
          ctx.fill();
        }
      }
    }
    rollRaf = requestAnimationFrame(drawRoll);
  };
  rollRaf = requestAnimationFrame(drawRoll);
}

function getSelectedPiece(): PianolaPiece {
  return PIANOLA_PIECES.find((p) => p.id === selectedPieceId) ?? PIANOLA_PIECES[0];
}

function stopPianola(): void {
  pianolaPlaying = false;
  cancelAnimationFrame(pianolaRaf);
  pianolaTime = 0;
  currentLiveCallout = '';
  triggeredEvents.clear();
  scheduledOffs.forEach((_t, kIdx) => triggerNoteOff(kIdx));
  scheduledOffs.clear();
  setSustain(false);
  updatePianolaUi();
}

function togglePianola(): void {
  if (pianolaPlaying) {
    pianolaPlaying = false;
    cancelAnimationFrame(pianolaRaf);
    updatePianolaUi();
    return;
  }
  const piece = getSelectedPiece();
  if (pianolaTime >= piece.durationSec) {
    pianolaTime = 0;
    triggeredEvents.clear();
  }
  pianolaPlaying = true;
  pianolaLastTs = performance.now();
  updatePianolaUi();

  const tick = (now: number) => {
    if (!pianolaPlaying) return;
    const dt = ((now - pianolaLastTs) / 1000) * pianolaTempo;
    pianolaLastTs = now;
    pianolaTime += dt;

    const p = getSelectedPiece();

    for (const [kIdx, offTime] of scheduledOffs.entries()) {
      if (pianolaTime >= offTime) {
        triggerNoteOff(kIdx);
        scheduledOffs.delete(kIdx);
      }
    }

    for (let i = 0; i < p.events.length; i++) {
      if (triggeredEvents.has(i)) continue;
      const ev = p.events[i];
      if (pianolaTime >= ev.timeSec) {
        triggeredEvents.add(i);
        if (ev.sustain !== undefined) setSustain(ev.sustain);
        const callout = lang === 'es' ? ev.labelEs : ev.labelEn;
        if (callout) currentLiveCallout = callout;
        const kIdx = Math.min(keys.length - 1, Math.max(0, ev.keyIndex));
        triggerNoteOn(kIdx, ev.velocity);
        scheduledOffs.set(kIdx, ev.timeSec + ev.durationSec);
      }
    }

    updatePianolaUi();

    if (pianolaTime >= p.durationSec) {
      stopPianola();
      return;
    }
    pianolaRaf = requestAnimationFrame(tick);
  };
  pianolaRaf = requestAnimationFrame(tick);
}

function updatePianolaUi(): void {
  const playBtn = document.getElementById('btn-pianola-play');
  const fill = document.getElementById('pianola-progress-fill');
  const timeEl = document.getElementById('pianola-time');
  const tickerEl = document.getElementById('live-ticker');
  const piece = getSelectedPiece();

  if (playBtn) {
    playBtn.textContent = pianolaPlaying ? `⏸ ${t().pause}` : `▶ ${t().play}`;
  }
  if (fill) {
    const pct = Math.min(100, (pianolaTime / piece.durationSec) * 100);
    fill.style.width = `${pct}%`;
  }
  if (timeEl) {
    timeEl.textContent = `${pianolaTime.toFixed(1)}s / ${piece.durationSec.toFixed(1)}s`;
  }
  if (tickerEl) {
    if (currentLiveCallout) {
      tickerEl.classList.add('callout-active');
      const msg = `✦ ${currentLiveCallout}`;
      tickerEl.textContent = msg;
      tickerEl.title = msg;
    } else {
      tickerEl.classList.remove('callout-active');
      const cue = `🎧 ${lang === 'es' ? piece.listenForEs : piece.listenForEn}`;
      tickerEl.textContent = cue;
      tickerEl.title = cue;
    }
  }
}

function toggleAbComparison(): void {
  if (currentVariant === 'estandar') {
    applyVariantLive(savedMicrotonalVariant || 'tercios');
  } else {
    savedMicrotonalVariant = currentVariant;
    applyVariantLive('estandar');
  }
}

function applyVariantLive(vId: VariantId): void {
  currentVariant = vId;
  if (vId !== 'estandar') savedMicrotonalVariant = vId;
  const v = VARIANTS[vId];
  currentAnchor = v.defaultAnchor;
  engine.setParam('edo', v.edo);
  keys = buildKeyboardLayout(currentVariant, currentAnchor, railsbackStretch, lang);
  if (qwertyBaseIndex > keys.length - 18) {
    qwertyBaseIndex = Math.max(0, keys.length - 18);
  }
  harp?.updateLayout(v, keys);
  renderApp();
  updatePianolaUi();
}

function applyKeyboardZoom(newZoom: number): void {
  const clamped = Math.max(1.0, Math.min(2.6, Math.round(newZoom * 10) / 10));
  const scrollEl = document.querySelector('.keyboard-scroll') as HTMLElement | null;
  const track = document.getElementById('keyboard-track');
  const rollTrack = document.getElementById('roll-track');

  let centerRatio = 0.5;
  if (scrollEl && scrollEl.scrollWidth > 0) {
    centerRatio = (scrollEl.scrollLeft + scrollEl.clientWidth / 2) / scrollEl.scrollWidth;
  }

  keyboardZoom = clamped;
  const widthPct = `${Math.round(keyboardZoom * 100)}%`;
  if (track) track.style.width = widthPct;
  if (rollTrack) rollTrack.style.width = widthPct;
  setText('zoom-val', widthPct);

  if (scrollEl) {
    requestAnimationFrame(() => {
      const targetLeft = centerRatio * scrollEl.scrollWidth - scrollEl.clientWidth / 2;
      scrollEl.scrollLeft = Math.max(0, targetLeft);
    });
  }
}

function rebuildKeyboardDOM(): void {
  const track = document.getElementById('keyboard-track');
  const rollTrack = document.getElementById('roll-track');
  if (!track) return;
  track.innerHTML = '';
  const widthPct = `${Math.round(keyboardZoom * 100)}%`;
  track.style.width = widthPct;
  if (rollTrack) rollTrack.style.width = widthPct;

  const qwertyBadgeByKeyIndex = new Map<number, string>();
  if (showQwertyHints) {
    for (const [, offset, label] of QWERTY_OFFSETS) {
      const idx = qwertyBaseIndex + offset;
      if (idx >= 0 && idx < keys.length && !qwertyBadgeByKeyIndex.has(idx)) {
        qwertyBadgeByKeyIndex.set(idx, label);
      }
    }
  }

  const whiteKeys = keys.filter((k) => !k.isBlack);
  const whiteCount = whiteKeys.length;

  let isPointerDown = false;
  let lastDragKey = -1;

  const stopDrag = () => {
    if (isPointerDown && lastDragKey >= 0) {
      triggerNoteOff(lastDragKey);
      lastDragKey = -1;
    }
    isPointerDown = false;
  };
  window.addEventListener('pointerup', stopDrag, { once: false });

  const whiteIndexMap = new Map<number, number>();
  whiteKeys.forEach((k, wIdx) => {
    whiteIndexMap.set(k.index, wIdx);
    const btn = document.createElement('div');
    btn.className = 'key-white';
    if (k.carrilloStep === 0) btn.classList.add('true-octave');
    if (activeKeys.has(k.index)) btn.classList.add('active');
    btn.dataset.keyIndex = String(k.index);
    btn.title = `#${k.keyNumber} (${k.visualName}) · ${k.freqHz.toFixed(1)} Hz · Carrillo ${k.carrilloStep}`;

    const qBadge = qwertyBadgeByKeyIndex.get(k.index);
    if (qBadge) {
      const qb = document.createElement('span');
      qb.className = 'qwerty-badge';
      qb.textContent = qBadge;
      btn.appendChild(qb);
    }

    if (showCarrilloNumbers) {
      const lbl = document.createElement('span');
      lbl.className = 'key-label';
      lbl.textContent = String(k.carrilloStep);
      btn.appendChild(lbl);
    }

    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      isPointerDown = true;
      lastDragKey = k.index;
      triggerNoteOn(k.index, 0.8);
    });
    btn.addEventListener('pointerenter', () => {
      if (isPointerDown && lastDragKey !== k.index) {
        if (lastDragKey >= 0) triggerNoteOff(lastDragKey);
        lastDragKey = k.index;
        triggerNoteOn(k.index, 0.72);
      }
    });
    btn.addEventListener('pointerup', () => {
      triggerNoteOff(k.index);
      isPointerDown = false;
      lastDragKey = -1;
    });

    track.appendChild(btn);
  });

  const whiteWidthPct = 100 / Math.max(1, whiteCount);
  const blackWidthPct = whiteWidthPct * 0.64;

  keys.forEach((k) => {
    if (!k.isBlack) return;
    let leftWhiteIdx = 0;
    for (let j = k.index - 1; j >= 0; j--) {
      if (!keys[j].isBlack) {
        leftWhiteIdx = whiteIndexMap.get(j) ?? 0;
        break;
      }
    }
    const leftPct = (leftWhiteIdx + 1) * whiteWidthPct - blackWidthPct / 2;

    const btn = document.createElement('div');
    btn.className = 'key-black';
    if (k.carrilloStep === 0) btn.classList.add('true-octave');
    if (activeKeys.has(k.index)) btn.classList.add('active');
    btn.style.left = `${leftPct}%`;
    btn.style.width = `${blackWidthPct}%`;
    btn.dataset.keyIndex = String(k.index);
    btn.title = `#${k.keyNumber} (${k.visualName}) · ${k.freqHz.toFixed(1)} Hz · Carrillo ${k.carrilloStep}`;

    const qBadge = qwertyBadgeByKeyIndex.get(k.index);
    if (qBadge) {
      const qb = document.createElement('span');
      qb.className = 'qwerty-badge';
      qb.textContent = qBadge;
      btn.appendChild(qb);
    }

    if (showCarrilloNumbers) {
      const lbl = document.createElement('span');
      lbl.className = 'key-label';
      lbl.textContent = String(k.carrilloStep);
      btn.appendChild(lbl);
    }

    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isPointerDown = true;
      lastDragKey = k.index;
      triggerNoteOn(k.index, 0.8);
    });
    btn.addEventListener('pointerenter', () => {
      if (isPointerDown && lastDragKey !== k.index) {
        if (lastDragKey >= 0) triggerNoteOff(lastDragKey);
        lastDragKey = k.index;
        triggerNoteOn(k.index, 0.72);
      }
    });
    btn.addEventListener('pointerup', (e) => {
      e.stopPropagation();
      triggerNoteOff(k.index);
      isPointerDown = false;
      lastDragKey = -1;
    });

    track.appendChild(btn);
  });
}

function selectPiece(pieceId: string): void {
  stopPianola();
  selectedPieceId = pieceId;
  const p = getSelectedPiece();
  if (autoSwitchPieceVariant && p.recommendedVariant !== currentVariant) {
    applyVariantLive(p.recommendedVariant);
    return;
  }
  renderApp();
}

function playIntervalDemo(stepOffset: number): void {
  const root = Math.min(keys.length - 25, 39);
  setSustain(true);
  triggerNoteOn(root, 0.78);
  setTimeout(() => triggerNoteOn(root + stepOffset, 0.78), 180);
  setTimeout(() => {
    triggerNoteOff(root);
    triggerNoteOff(root + stepOffset);
    setSustain(false);
  }, 2200);
}

function renderApp(): void {
  const app = document.getElementById('app');
  if (!app) return;
  const txt = t();
  const v = VARIANTS[currentVariant];
  const piece = getSelectedPiece();
  const isComparing12 = currentVariant === 'estandar';

  app.innerHTML = `
    <div class="app-shell">
      <header class="top-bar">
        <div class="brand">
          <h1>${txt.brandTitle}</h1>
          <div class="brand-meta">
            <span>${txt.brandSub}</span>
            <span>·</span>
            <span>${txt.creditBy} <a href="https://www.instagram.com/laurorobles/" target="_blank" rel="noopener noreferrer">@laurorobles</a></span>
          </div>
        </div>
        <div class="top-actions">
          <button class="btn" id="btn-guide">📘 ${txt.guideBtn}</button>
          <button class="btn" id="btn-research">📖 ${txt.researchBtn}</button>
          <button class="btn" id="btn-lab">🔬 ${txt.labBtn}</button>
          <button class="btn" id="btn-export">⬇ ${txt.exportScl}</button>
          <button class="btn ${midiConnected ? 'active' : ''}" id="btn-midi">🎹 ${midiConnected ? txt.midiConnected : txt.midiBtn}</button>
          <a class="btn" href="https://github.com/laurorobles/sonido13-piano" target="_blank" rel="noopener noreferrer" style="text-decoration:none" title="GitHub">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>
            GitHub
          </a>
          <div class="lang-group" role="group">
            <button type="button" data-set-lang="es" class="${lang === 'es' ? 'on' : ''}">ES</button>
            <button type="button" data-set-lang="en" class="${lang === 'en' ? 'on' : ''}">EN</button>
          </div>
        </div>
      </header>

      <!-- 1. Compact Instrument + 10-Piece Repertoire Console -->
      <section class="top-console-card" aria-label="${txt.repertoireStripLabel}">
        <div class="instrument-selector-row">
          <div class="field-group">
            <div class="panel-label">
              <span>${txt.variantLabel}</span>
              <label style="cursor:pointer;display:flex;align-items:center;gap:4px;font-weight:400;text-transform:none;letter-spacing:0;color:var(--text-muted)">
                <input type="checkbox" id="chk-autoswitch" ${autoSwitchPieceVariant ? 'checked' : ''} />
                ${txt.autoSwitchVariant}
              </label>
            </div>
            <select class="select-input" id="select-variant">
              ${Object.values(VARIANTS)
                .map(
                  (item) =>
                    `<option value="${item.id}" ${item.id === currentVariant ? 'selected' : ''}>${
                      lang === 'es' ? item.nameEs : item.nameEn
                    }</option>`
                )
                .join('')}
            </select>
          </div>

          <div class="field-group">
            <div class="panel-label">
              <span>${txt.anchorLabel}</span>
              <span>${v.numKeys} ${lang === 'es' ? 'teclas' : 'keys'} · ${v.octaveSpan.toFixed(2)} oct</span>
            </div>
            <select class="select-input" id="select-anchor" ${currentVariant === 'estandar' || currentVariant === 'dieciseisavos' || currentVariant === 'tonos-enteros' ? 'disabled' : ''}>
              ${ANCHOR_PRESETS.map(
                (a) =>
                  `<option value="${a.id}" ${a.id === currentAnchor ? 'selected' : ''}>${
                    lang === 'es' ? a.nameEs : a.nameEn
                  }</option>`
              ).join('')}
            </select>
          </div>

          <div class="range-badge" id="range-badge">
            ${keys[0].freqHz.toFixed(1)} Hz → ${keys[keys.length - 1].freqHz.toFixed(1)} Hz
          </div>
        </div>

        <div class="rep-pills">
          ${PIANOLA_PIECES.map(
            (p) =>
              `<button type="button" class="rep-pill ${p.id === selectedPieceId ? 'active' : ''}" data-piece-id="${p.id}">
                ${lang === 'es' ? p.shortEs : p.shortEn}
              </button>`
          ).join('')}
        </div>

        <div class="transport-bar">
          <div class="rep-transport">
            <button type="button" class="btn primary" id="btn-pianola-play">▶ ${txt.play}</button>
            <button type="button" class="btn" id="btn-pianola-stop" title="${txt.stop}">⏹</button>
            <button type="button" class="btn ab-btn ${isComparing12 ? 'comparing' : ''}" id="btn-ab-toggle">
              ${
                isComparing12
                  ? lang === 'es'
                    ? '⇄ Sonando Normal (Volver)'
                    : '⇄ Normal Piano (Back)'
                  : lang === 'es'
                    ? '⇄ Comparar: Carrillo ↔ Normal'
                    : '⇄ Compare: Carrillo ↔ Normal'
              }
            </button>
            <button type="button" class="btn ${showPieceDossier ? 'active' : ''}" id="btn-toggle-dossier" style="width:124px">
              ${
                showPieceDossier
                  ? lang === 'es'
                    ? '▴ Ocultar historia'
                    : '▴ Hide story'
                  : lang === 'es'
                    ? '▾ Sobre la pieza'
                    : '▾ About piece'
              }
            </button>
          </div>

          <div class="pianola-progress-wrap">
            <div class="progress-track"><div class="progress-fill" id="pianola-progress-fill"></div></div>
            <span id="pianola-time">0.0s / ${piece.durationSec.toFixed(1)}s</span>
            <select id="select-tempo" class="select-input" style="width:62px;padding:3px 5px;font-size:0.71rem" title="${txt.speed}">
              ${[0.7, 0.85, 1.0, 1.2, 1.4]
                .map((sp) => `<option value="${sp}" ${pianolaTempo === sp ? 'selected' : ''}>${sp}×</option>`)
                .join('')}
            </select>
          </div>
        </div>

        <div class="live-ticker" id="live-ticker">
          🎧 ${lang === 'es' ? piece.listenForEs : piece.listenForEn}
        </div>

        <!-- Piece Musicological Dossier right beneath the piece selector & transport! -->
        <div class="piece-dossier-inline ${showPieceDossier ? '' : 'collapsed'}" id="piece-dossier-panel">
          <div class="dossier-header">
            <div class="dossier-top-line">
              <div class="dossier-title-wrap">
                <h3>${lang === 'es' ? piece.titleEs : piece.titleEn}</h3>
              </div>
              <div class="dossier-badges">
                <span class="d-badge">${piece.badges.system}</span>
                <span class="d-badge">${piece.badges.yearRef}</span>
                <span class="d-badge">${lang === 'es' ? piece.badges.keyIntervalsEs : piece.badges.keyIntervalsEn}</span>
                <span class="d-badge">${piece.badges.carrilloFormula}</span>
              </div>
            </div>
            <p class="dossier-desc">${lang === 'es' ? piece.descEs : piece.descEn}</p>
          </div>

          <div class="dossier-columns">
            <div class="dossier-col">
              <h4>${lang === 'es' ? '1. La historia detrás' : '1. The Story Behind It'}</h4>
              <p>${lang === 'es' ? piece.historicalContextEs : piece.historicalContextEn}</p>
            </div>
            <div class="dossier-col">
              <h4>${lang === 'es' ? '2. ¿Qué pasa en el sonido?' : '2. What Happens in the Sound?'}</h4>
              <p>${lang === 'es' ? piece.acousticAnalysisEs : piece.acousticAnalysisEn}</p>
            </div>
            <div class="dossier-col">
              <h4>${lang === 'es' ? '3. Pruébalo tú mismo' : '3. Try It Yourself'}</h4>
              <p>${lang === 'es' ? piece.listeningExperimentEs : piece.listeningExperimentEn}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Physical Piano Cabinet (Carl Sauter 1958) — Zero-Shift Fixed Geometry -->
      <main class="piano-cabinet">
        <div class="harp-stage">
          <canvas id="harp-canvas"></canvas>
        </div>

        <div class="fallboard">
          <div class="sauter-decal">
            <span class="maker">CARL SAUTER</span>
            <span class="model">METAMORFOSEADOR · ${v.year}</span>
          </div>

          <div class="notation-hud" id="notation-hud">
            <div class="hud-metric">
              <span class="k" id="hud-k-step">${txt.stepLabel}</span>
              <span class="v" id="hud-v-step">—</span>
            </div>
            <div class="hud-metric">
              <span class="k" id="hud-k-90">${txt.scale90Label}</span>
              <span class="v" id="hud-v-90">—</span>
            </div>
            <div class="hud-metric">
              <span class="k">${txt.freqLabel}</span>
              <span class="v" id="hud-v-freq">— Hz</span>
            </div>
            <div class="hud-metric">
              <span class="k">${txt.nearest12Label}</span>
              <span class="v" id="hud-v-12">—</span>
            </div>
            <div class="hud-metric">
              <span class="k">${txt.inharmLabel}</span>
              <span class="v" id="hud-v-b">—</span>
            </div>
            <div class="hud-metric">
              <span class="k">${txt.keyVisualLabel}</span>
              <span class="v" id="hud-v-key">—</span>
            </div>
          </div>

          <div class="desk-tools">
            <button type="button" class="btn ${showCarrilloNumbers ? 'active' : ''}" id="btn-toggle-nums" title="${txt.showCarrilloNums}">
              0–${v.edo - 1}
            </button>
            <button type="button" class="btn ${showQwertyHints ? 'active' : ''}" id="btn-toggle-qwerty" title="${txt.showQwertyHints}">
              A–Ñ
            </button>
            <div class="zoom-controls" title="Zoom teclado">
              <button class="btn" id="btn-zoom-out">−</button>
              <span class="zoom-val" id="zoom-val">${Math.round(keyboardZoom * 100)}%</span>
              <button class="btn" id="btn-zoom-in">+</button>
              <button class="btn" id="btn-zoom-fit">${lang === 'es' ? 'Todo' : 'Fit'}</button>
            </div>
          </div>
        </div>

        <div class="keyboard-scroll">
          <div class="roll-track" id="roll-track">
            <canvas id="roll-canvas"></canvas>
          </div>
          <div class="keyboard-track" id="keyboard-track"></div>
        </div>

        <div class="pedals-bar">
          <div class="keybed-legend">
            <span style="color:var(--gold-bright)">${txt.eduOctaveLegend}</span>
          </div>
          <div class="pedals-center">
            <button class="pedal-btn ${unaCordaDown ? 'active' : ''}" id="pedal-unacorda">
              <div class="pedal-brass"></div>
              <span>${txt.pedalUnaCorda}</span>
            </button>
            <button class="pedal-btn" id="pedal-sostenuto">
              <div class="pedal-brass"></div>
              <span>${txt.pedalSostenuto}</span>
            </button>
            <button class="pedal-btn ${sustainDown ? 'active' : ''}" id="pedal-sustain">
              <div class="pedal-brass"></div>
              <span>${txt.pedalSustain}</span>
            </button>
          </div>
          <div class="keybed-legend right">
            <button class="btn" id="btn-oct-down" style="padding:3px 7px;font-size:0.69rem">Z ◀</button>
            <span id="pc-reg-label">PC: #${qwertyBaseIndex + 1} (${keys[Math.min(keys.length - 1, qwertyBaseIndex)]?.nearest12Name ?? ''})</span>
            <button class="btn" id="btn-oct-up" style="padding:3px 7px;font-size:0.69rem">▶ X</button>
          </div>
        </div>
      </main>

      <!-- 3. Live Educational Telemetry Deck (Locked Height & Columns) -->
      <section class="edu-telemetry-grid">
        <div class="panel-card">
          <div class="panel-label">
            <span>${txt.eduMetamorphTitle}</span>
            <span class="tabular">${v.edo} ${lang === 'es' ? 'notas por octava' : 'notes per octave'}</span>
          </div>
          <div class="metamorph-box" id="metamorph-box">
            <div class="meta-col">
              <span class="mk">${txt.eduVisualSpan}</span>
              <span class="mv" id="meta-v-span">—</span>
            </div>
            <div class="meta-col">
              <span class="mk">${txt.eduNormalPiano}</span>
              <span class="mv" id="meta-v-12">—</span>
            </div>
            <div class="meta-col">
              <span class="mk" id="meta-k-here">${txt.eduSoundingHere}</span>
              <span class="mv highlight" id="meta-v-here">—</span>
            </div>
          </div>
          <div class="octave-ruler">
            <span>Do = 0</span>
            <span class="mark-12">${lang === 'es' ? 'En 12 teclas aún no completas la octava' : '12 keys is smaller than an octave'}</span>
            <span class="mark-edo">${v.edo} ${lang === 'es' ? 'teclas = ¡Siguiente Do completo!' : 'keys = Next full C octave!'}</span>
          </div>
        </div>

        <div class="panel-card" style="justify-content:space-between">
          <div class="panel-label">
            <span>${txt.eduCircleTitle}</span>
          </div>
          <div class="circle-wrap">
            <svg id="pitch-circle-svg" viewBox="0 0 82 82"></svg>
            <div class="circle-legend">
              ${
                lang === 'es'
                  ? 'Cada puntito es un escalón antes de llegar al otro Do. Toca acordes para ver sus figuras.'
                  : 'Each dot is a step before reaching the next C. Play chords to see their shapes.'
              }
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Acoustic Calibration Strip -->
      <section class="panel-card">
        <div class="panel-label">
          <span>${txt.acousticTitle}</span>
          <span>${lang === 'es' ? 'Simulación física en vivo' : 'Live physical simulation'}</span>
        </div>
        <div class="calibration-grid">
          <div class="slider-item">
            <div class="slider-head"><span>${txt.hammer}</span><span class="val" id="val-hammer">${Math.round(uiParams.hammerHardness * 100)}%</span></div>
            <input type="range" id="sl-hammer" min="0.1" max="1" step="0.01" value="${uiParams.hammerHardness}" />
            <span class="slider-tip">${txt.hammerTip}</span>
          </div>
          <div class="slider-item">
            <div class="slider-head"><span>${txt.unison}</span><span class="val" id="val-unison">${Math.round(uiParams.unisonWidth * 100)}%</span></div>
            <input type="range" id="sl-unison" min="0" max="1" step="0.01" value="${uiParams.unisonWidth}" />
            <span class="slider-tip">${txt.unisonTip}</span>
          </div>
          <div class="slider-item">
            <div class="slider-head"><span>${txt.sympathetic}</span><span class="val" id="val-symp">${Math.round(uiParams.sympathetic * 100)}%</span></div>
            <input type="range" id="sl-symp" min="0" max="1" step="0.01" value="${uiParams.sympathetic}" />
            <span class="slider-tip">${txt.sympatheticTip}</span>
          </div>
          <div class="slider-item">
            <div class="slider-head"><span>${txt.inharmonicity}</span><span class="val" id="val-inharm">${uiParams.inharmonicityScale.toFixed(1)}×</span></div>
            <input type="range" id="sl-inharm" min="0" max="2" step="0.05" value="${uiParams.inharmonicityScale}" />
            <span class="slider-tip">${txt.inharmonicityTip}</span>
          </div>
          <div class="slider-item">
            <div class="slider-head"><span>${txt.railsback}</span><span class="val" id="val-railsback">${railsbackStretch.toFixed(1)}×</span></div>
            <input type="range" id="sl-railsback" min="0" max="1.5" step="0.1" value="${railsbackStretch}" />
            <span class="slider-tip">${txt.railsbackTip}</span>
          </div>
          <div class="slider-item">
            <div class="slider-head"><span>${txt.soundboard}</span><span class="val" id="val-sb">${Math.round(uiParams.soundboardMix * 100)}%</span></div>
            <input type="range" id="sl-sb" min="0" max="1" step="0.01" value="${uiParams.soundboardMix}" />
            <span class="slider-tip">${txt.soundboardTip}</span>
          </div>
          <div class="slider-item">
            <div class="slider-head"><span>${txt.volume}</span><span class="val" id="val-vol">${Math.round(uiParams.masterGain * 100)}%</span></div>
            <input type="range" id="sl-vol" min="0" max="1" step="0.01" value="${uiParams.masterGain}" />
            <span class="slider-tip">${lang === 'es' ? 'Salida estéreo con limitador suave' : 'Stereo output with soft limiter'}</span>
          </div>
        </div>
      </section>

      <!-- 6. Footer Credits -->
      <footer class="footer-credits">
        <div>${txt.footerShortcuts}</div>
        <div>
          ${txt.footerDisclaimer}
          ${txt.creditBy}
          <a href="https://www.instagram.com/laurorobles/" target="_blank" rel="noopener noreferrer" class="footer-link">@laurorobles</a>
        </div>
        <div style="margin-top:4px">
          <a href="https://extasisrecords.bandcamp.com" target="_blank" rel="noopener noreferrer" class="footer-link">@extasisrecords</a>
        </div>
      </footer>
    </div>

    <!-- Interactive Guide Modal -->
    <div class="modal-backdrop hidden" id="modal-guide">
      <div class="modal-box">
        <div class="modal-header">
          <h2>📘 ${txt.guideTitle}</h2>
          <button class="btn" id="close-guide">${txt.close}</button>
        </div>
        <div class="modal-body">${GUIDE_HTML[lang]}</div>
      </div>
    </div>

    <!-- Research Modal -->
    <div class="modal-backdrop hidden" id="modal-research">
      <div class="modal-box">
        <div class="modal-header">
          <h2>📖 ${txt.researchBtn} · Sonido 13</h2>
          <button class="btn" id="close-research">${txt.close}</button>
        </div>
        <div class="modal-body">${RESEARCH_HTML[lang]}</div>
      </div>
    </div>

    <!-- 18-EDO Acoustic Lab Modal -->
    <div class="modal-backdrop hidden" id="modal-lab">
      <div class="modal-box">
        <div class="modal-header">
          <h2>🔬 ${txt.labTitle}</h2>
          <button class="btn" id="close-lab">${txt.close}</button>
        </div>
        <div class="modal-body">
          <p>${
            lang === 'es'
              ? 'Haz clic en cada botón para escuchar al instante qué hace tan distinto a este piano frente a uno común:'
              : 'Click each button to hear right away what makes this piano sound so different from an ordinary one:'
          }</p>
          <div class="lab-grid">
            <div class="lab-card">
              <h4>${lang === 'es' ? '1. Ni alegre ni triste' : '1. Neither happy nor sad'}</h4>
              <p>${lang === 'es' ? 'Una nota intermedia preciosa que vive justo entre un acorde mayor y uno menor.' : 'A beautiful in-between note living right between bright major and wistful minor.'}</p>
              <button class="btn primary" data-demo-interval="5">▶ ${lang === 'es' ? 'Escuchar (+5 teclas)' : 'Listen (+5 keys)'}</button>
            </div>
            <div class="lab-card">
              <h4>${lang === 'es' ? '2. La nota escondida' : '2. The hidden note'}</h4>
              <p>${lang === 'es' ? 'Un sonido natural de las cuerdas que en los pianos normales cae "en la grieta" entre dos teclas.' : 'A natural resonance of strings that normally falls right in the crack between two piano keys.'}</p>
              <button class="btn primary" data-demo-interval="8">▶ ${lang === 'es' ? 'Escuchar (+8 teclas)' : 'Listen (+8 keys)'}</button>
            </div>
            <div class="lab-card">
              <h4>${lang === 'es' ? '3. ¿Qué pasó con las 12 teclas?' : '3. What happened to 12 keys?'}</h4>
              <p>${lang === 'es' ? 'Si abres la mano 12 teclas como siempre, ¡todavía no llegas al otro Do! Suena más cerrado.' : 'Spanning 12 keys like usual doesn’t reach the next C yet—it sounds closer and warmer.'}</p>
              <button class="btn primary" data-demo-interval="12">▶ ${lang === 'es' ? 'Escuchar (+12 teclas)' : 'Listen (+12 keys)'}</button>
            </div>
            <div class="lab-card">
              <h4>${lang === 'es' ? '4. El siguiente Do real' : '4. The true next C'}</h4>
              <p>${lang === 'es' ? 'Al recorrer 18 teclas completas escuchas por fin el salto limpio y brillante de una octava.' : 'Spanning 18 full keys finally reaches the clean, ringing leap of a full octave!'}</p>
              <button class="btn primary" data-demo-interval="18">▶ ${lang === 'es' ? 'Escuchar (+18 teclas)' : 'Listen (+18 keys)'}</button>
            </div>
          </div>
          <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn primary" id="lab-sw-18">${txt.compare18}</button>
            <button class="btn" id="lab-sw-12">${txt.compare12}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const canvas = document.getElementById('harp-canvas') as HTMLCanvasElement;
  if (harp) harp.destroy();
  harp = new HarpCanvas(canvas, v, keys);
  if (engine.getAnalyser()) harp.setAnalyser(engine.getAnalyser());

  rebuildKeyboardDOM();
  updateNotationHud();
  updateMetamorphosisBox();
  updatePitchCircle();
  startRollLoop();
  bindEvents();
}

function shiftQwertyRegister(delta: number): void {
  qwertyBaseIndex = Math.max(0, Math.min(Math.max(0, keys.length - 18), qwertyBaseIndex + delta));
  setText('pc-reg-label', `PC: #${qwertyBaseIndex + 1} (${keys[Math.min(keys.length - 1, qwertyBaseIndex)]?.nearest12Name ?? ''})`);
  rebuildKeyboardDOM();
}

function bindEvents(): void {
  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetLang = (btn as HTMLElement).dataset.setLang as Lang;
      if (targetLang && targetLang !== lang) {
        lang = targetLang;
        keys = buildKeyboardLayout(currentVariant, currentAnchor, railsbackStretch, lang);
        renderApp();
        updatePianolaUi();
      }
    });
  });

  document.querySelectorAll('[data-piece-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.pieceId;
      if (id) selectPiece(id);
    });
  });

  document.getElementById('chk-autoswitch')?.addEventListener('change', (e) => {
    autoSwitchPieceVariant = (e.target as HTMLInputElement).checked;
  });

  document.getElementById('btn-ab-toggle')?.addEventListener('click', () => toggleAbComparison());

  document.getElementById('btn-toggle-dossier')?.addEventListener('click', (e) => {
    showPieceDossier = !showPieceDossier;
    const panel = document.getElementById('piece-dossier-panel');
    const btn = e.currentTarget as HTMLElement;
    panel?.classList.toggle('collapsed', !showPieceDossier);
    btn.classList.toggle('active', showPieceDossier);
    btn.textContent = showPieceDossier
      ? lang === 'es'
        ? '▴ Ocultar historia'
        : '▴ Hide story'
      : lang === 'es'
        ? '▾ Sobre la pieza'
        : '▾ About piece';
  });

  document.getElementById('select-tempo')?.addEventListener('change', (e) => {
    pianolaTempo = Number((e.target as HTMLSelectElement).value) || 1.0;
  });

  document.getElementById('select-variant')?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value as VariantId;
    applyVariantLive(val);
  });

  document.getElementById('select-anchor')?.addEventListener('change', (e) => {
    currentAnchor = (e.target as HTMLSelectElement).value as AnchorId;
    keys = buildKeyboardLayout(currentVariant, currentAnchor, railsbackStretch, lang);
    harp?.updateLayout(VARIANTS[currentVariant], keys);
    setText('range-badge', `${keys[0].freqHz.toFixed(1)} Hz → ${keys[keys.length - 1].freqHz.toFixed(1)} Hz`);
    rebuildKeyboardDOM();
    updateNotationHud();
    updateMetamorphosisBox();
    updatePitchCircle();
  });

  document.getElementById('btn-toggle-nums')?.addEventListener('click', (e) => {
    showCarrilloNumbers = !showCarrilloNumbers;
    (e.currentTarget as HTMLElement).classList.toggle('active', showCarrilloNumbers);
    rebuildKeyboardDOM();
  });

  document.getElementById('btn-toggle-qwerty')?.addEventListener('click', (e) => {
    showQwertyHints = !showQwertyHints;
    (e.currentTarget as HTMLElement).classList.toggle('active', showQwertyHints);
    rebuildKeyboardDOM();
  });

  document.getElementById('btn-pianola-play')?.addEventListener('click', () => togglePianola());
  document.getElementById('btn-pianola-stop')?.addEventListener('click', () => stopPianola());

  document.getElementById('btn-export')?.addEventListener('click', () => {
    const scl = generateScalaScl(currentVariant);
    const kbm = generateScalaKbm(currentVariant, currentAnchor);
    downloadFile(`sonido13_${currentVariant}.scl`, scl);
    setTimeout(() => downloadFile(`sonido13_${currentVariant}_${currentAnchor}.kbm`, kbm), 200);
  });

  document.getElementById('btn-midi')?.addEventListener('click', async () => {
    await engine.init();
    const res = await engine.enableMidi(
      (kIdx, vel, isOn) => {
        if (isOn) triggerNoteOn(kIdx, vel);
        else triggerNoteOff(kIdx);
      },
      (down) => setSustain(down)
    );
    midiConnected = res.supported;
    renderApp();
  });

  document.getElementById('pedal-sustain')?.addEventListener('click', () => setSustain(!sustainDown));
  document.getElementById('pedal-unacorda')?.addEventListener('click', () => setUnaCorda(!unaCordaDown));
  document.getElementById('btn-oct-down')?.addEventListener('click', () => shiftQwertyRegister(-12));
  document.getElementById('btn-oct-up')?.addEventListener('click', () => shiftQwertyRegister(12));

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => applyKeyboardZoom(keyboardZoom - 0.2));
  document.getElementById('btn-zoom-in')?.addEventListener('click', () => applyKeyboardZoom(keyboardZoom + 0.2));
  document.getElementById('btn-zoom-fit')?.addEventListener('click', () => applyKeyboardZoom(1.0));

  const bindModal = (openId: string, modalId: string, closeId: string) => {
    const m = document.getElementById(modalId);
    document.getElementById(openId)?.addEventListener('click', () => m?.classList.remove('hidden'));
    document.getElementById(closeId)?.addEventListener('click', () => m?.classList.add('hidden'));
    m?.addEventListener('click', (e) => {
      if (e.target === m) m.classList.add('hidden');
    });
  };
  bindModal('btn-guide', 'modal-guide', 'close-guide');
  bindModal('btn-research', 'modal-research', 'close-research');
  bindModal('btn-lab', 'modal-lab', 'close-lab');

  document.querySelectorAll('[data-demo-interval]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const steps = Number((btn as HTMLElement).dataset.demoInterval);
      playIntervalDemo(steps);
    });
  });

  document.getElementById('lab-sw-18')?.addEventListener('click', () => applyVariantLive('tercios'));
  document.getElementById('lab-sw-12')?.addEventListener('click', () => applyVariantLive('estandar'));

  const bindSlider = (id: string, valId: string, cb: (v: number) => void, fmt: (v: number) => string) => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    el?.addEventListener('input', () => {
      const v = Number(el.value);
      setText(valId, fmt(v));
      cb(v);
    });
  };

  bindSlider(
    'sl-hammer',
    'val-hammer',
    (v) => {
      uiParams.hammerHardness = v;
      engine.setParam('hammerHardness', v);
    },
    (v) => `${Math.round(v * 100)}%`
  );
  bindSlider(
    'sl-unison',
    'val-unison',
    (v) => {
      uiParams.unisonWidth = v;
      engine.setParam('unisonWidth', v);
    },
    (v) => `${Math.round(v * 100)}%`
  );
  bindSlider(
    'sl-symp',
    'val-symp',
    (v) => {
      uiParams.sympathetic = v;
      engine.setParam('sympathetic', v);
    },
    (v) => `${Math.round(v * 100)}%`
  );
  bindSlider(
    'sl-inharm',
    'val-inharm',
    (v) => {
      uiParams.inharmonicityScale = v;
      engine.setParam('inharmonicityScale', v);
    },
    (v) => `${v.toFixed(1)}×`
  );
  bindSlider(
    'sl-railsback',
    'val-railsback',
    (v) => {
      railsbackStretch = v;
      keys = buildKeyboardLayout(currentVariant, currentAnchor, railsbackStretch, lang);
    },
    (v) => `${v.toFixed(1)}×`
  );
  bindSlider(
    'sl-sb',
    'val-sb',
    (v) => {
      uiParams.soundboardMix = v;
      engine.setParam('soundboardMix', v);
    },
    (v) => `${Math.round(v * 100)}%`
  );
  bindSlider(
    'sl-vol',
    'val-vol',
    (v) => {
      uiParams.masterGain = v;
      engine.setParam('masterGain', v);
    },
    (v) => `${Math.round(v * 100)}%`
  );
}

window.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const tag = (e.target as HTMLElement)?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  if (e.code === 'Space' && tag !== 'SELECT' && tag !== 'BUTTON') {
    e.preventDefault();
    setSustain(true);
    return;
  }
  if (e.key === 'Shift') {
    setUnaCorda(true);
    return;
  }
  const k = e.key.toLowerCase();
  if (k === 'z') {
    shiftQwertyRegister(-12);
    return;
  }
  if (k === 'x') {
    shiftQwertyRegister(12);
    return;
  }
  const found = QWERTY_OFFSETS.find(([ch]) => ch === k);
  if (found && !heldQwerty.has(k)) {
    const idx = qwertyBaseIndex + found[1];
    if (idx >= 0 && idx < keys.length) {
      heldQwerty.set(k, idx);
      triggerNoteOn(idx, 0.78);
    }
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    setSustain(false);
    return;
  }
  if (e.key === 'Shift') {
    setUnaCorda(false);
    return;
  }
  const k = e.key.toLowerCase();
  const idx = heldQwerty.get(k);
  if (idx !== undefined) {
    heldQwerty.delete(k);
    triggerNoteOff(idx);
  }
});

renderApp();
