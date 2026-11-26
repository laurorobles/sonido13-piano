export type VariantId = 'tercios' | 'cuartos' | 'tonos-enteros' | 'dieciseisavos' | 'estandar';

export type AnchorId = 'c4-40' | 'a4-49' | 'a1-1' | 'c2-1' | 'a0-1';

export interface InstrumentVariant {
  id: VariantId;
  edo: number;
  numKeys: number;
  firstMidiVisual: number; // Visual keyboard start (e.g. 21 = A0 on 88-key)
  nameEs: string;
  nameEn: string;
  subtitleEs: string;
  subtitleEn: string;
  bodyStyle: 'baby-grand' | 'upright';
  year: string;
  builder: string;
  defaultAnchor: AnchorId;
  stepCents: number;
  octaveSpan: number;
}

export interface AnchorPreset {
  id: AnchorId;
  nameEs: string;
  nameEn: string;
  refKeyIndex: number; // 0-based index on 88-key board (Key 40 = index 39, Key 49 = index 48, Key 1 = index 0)
  refFreqHz: number;
  noteLabel: string;
  descEs: string;
  descEn: string;
}

export interface KeyInfo {
  index: number; // 0-based
  keyNumber: number; // 1-based (1..88 or 1..96)
  midiVisual: number; // Visual piano key identity (for white/black pattern)
  isBlack: boolean;
  visualName: string; // e.g. "C4", "A4"
  freqHz: number;
  inharmonicityB: number;
  carrilloStep: number; // 0 .. edo-1
  carrilloOctave: number;
  carrillo90: number | null; // For 18-EDO: step * 5 (0..85)
  nearest12Name: string;
  centsFromNearest12: number;
}

export const VARIANTS: Record<VariantId, InstrumentVariant> = {
  tercios: {
    id: 'tercios',
    edo: 18,
    numKeys: 88,
    firstMidiVisual: 21, // A0
    nameEs: 'Tercios de Tono (18-EDO)',
    nameEn: 'Third-Tones (18-EDO)',
    subtitleEs: 'Media cola Carl Sauter (1958) · 88 teclas · 4.83 octavas',
    subtitleEn: 'Carl Sauter Baby Grand (1958) · 88 keys · 4.83 octaves',
    bodyStyle: 'baby-grand',
    year: '1958',
    builder: 'Carl Sauter (Spaichingen)',
    defaultAnchor: 'c4-40',
    stepCents: 1200 / 18,
    octaveSpan: 87 / 18,
  },
  cuartos: {
    id: 'cuartos',
    edo: 24,
    numKeys: 88,
    firstMidiVisual: 21,
    nameEs: 'Cuartos de Tono (24-EDO)',
    nameEn: 'Quarter-Tones (24-EDO)',
    subtitleEs: 'Metamorfoseador Sauter (1958) · 88 teclas · 3.63 octavas',
    subtitleEn: 'Sauter Metamorphoser (1958) · 88 keys · 3.63 octaves',
    bodyStyle: 'upright',
    year: '1958',
    builder: 'Carl Sauter (Spaichingen)',
    defaultAnchor: 'c4-40',
    stepCents: 50,
    octaveSpan: 87 / 24,
  },
  'tonos-enteros': {
    id: 'tonos-enteros',
    edo: 6,
    numKeys: 43,
    firstMidiVisual: 36, // C2
    nameEs: 'Tonos Enteros (6-EDO)',
    nameEn: 'Whole-Tones (6-EDO)',
    subtitleEs: 'Metamorfoseador Sauter (1958) · 43 teclas · 7.0 octavas',
    subtitleEn: 'Sauter Metamorphoser (1958) · 43 keys · 7.0 octaves',
    bodyStyle: 'upright',
    year: '1958',
    builder: 'Carl Sauter (Spaichingen)',
    defaultAnchor: 'c2-1',
    stepCents: 200,
    octaveSpan: 42 / 6,
  },
  dieciseisavos: {
    id: 'dieciseisavos',
    edo: 96,
    numKeys: 96,
    firstMidiVisual: 24, // C1 visual layout
    nameEs: 'Dieciseisavos de Tono (96-EDO)',
    nameEn: 'Sixteenth-Tones (96-EDO)',
    subtitleEs: 'Emblema del Sonido 13 (1958) · 96 teclas · 1 octava (Do4–Do5)',
    subtitleEn: 'Sonido 13 Emblem (1958) · 96 keys · 1 octave (C4–C5)',
    bodyStyle: 'upright',
    year: '1958',
    builder: 'Carl Sauter (Spaichingen)',
    defaultAnchor: 'c4-40',
    stepCents: 12.5,
    octaveSpan: 1.0,
  },
  estandar: {
    id: 'estandar',
    edo: 12,
    numKeys: 88,
    firstMidiVisual: 21,
    nameEs: 'Piano Estándar (12-EDO)',
    nameEn: 'Standard Piano (12-EDO)',
    subtitleEs: 'Referencia acústica comparativa · 88 teclas · 7.25 octavas',
    subtitleEn: 'Comparative acoustic reference · 88 keys · 7.25 octaves',
    bodyStyle: 'baby-grand',
    year: 'Ref.',
    builder: 'Referencia 12-EDO',
    defaultAnchor: 'a4-49',
    stepCents: 100,
    octaveSpan: 87 / 12,
  },
};

export const ANCHOR_PRESETS: AnchorPreset[] = [
  {
    id: 'c4-40',
    nameEs: 'Do central (Tecla 40 = Do4)',
    nameEn: 'Middle C (Key 40 = C4)',
    refKeyIndex: 39,
    refFreqHz: 261.625565,
    noteLabel: 'Do4 · 261.63 Hz',
    descEs: 'Equilibrio óptimo en el registro central; conserva Do = 0 en el centro del teclado (58.27 – 1661.22 Hz).',
    descEn: 'Optimal balance in middle register; preserves C = 0 at keyboard center (58.27 – 1661.22 Hz).',
  },
  {
    id: 'a4-49',
    nameEs: 'La de concierto (Tecla 49 = La4)',
    nameEn: 'Concert A (Key 49 = A4)',
    refKeyIndex: 48,
    refFreqHz: 440.0,
    noteLabel: 'La4 · 440.00 Hz',
    descEs: 'Ideal para concertar con orquesta tradicional como en el Concertino (69.30 – 1975.53 Hz).',
    descEn: 'Ideal for playing with traditional orchestra as in the Concertino (69.30 – 1975.53 Hz).',
  },
  {
    id: 'a1-1',
    nameEs: 'Inicio en La1 (Tecla 1 = La1)',
    nameEn: 'Start at A1 (Key 1 = A1)',
    refKeyIndex: 0,
    refFreqHz: 55.0,
    noteLabel: 'La1 · 55.00 Hz',
    descEs: 'Mantiene la primera tecla en La, una octava arriba del La0 estándar (55.00 – 1567.98 Hz).',
    descEn: 'Keeps first key on A, one octave above standard A0 (55.00 – 1567.98 Hz).',
  },
  {
    id: 'c2-1',
    nameEs: 'Inicio en Do2 (Tecla 1 = Do2)',
    nameEn: 'Start at C2 (Key 1 = C2)',
    refKeyIndex: 0,
    refFreqHz: 65.406391,
    noteLabel: 'Do2 · 65.41 Hz',
    descEs: 'Alinea el extremo grave con la convención Do = 0 del sistema numérico de Carrillo (65.41 – 1864.66 Hz).',
    descEn: 'Aligns bass end with Carrillo’s C = 0 numerical notation convention (65.41 – 1864.66 Hz).',
  },
  {
    id: 'a0-1',
    nameEs: 'Inicio en La0 estándar (Tecla 1 = La0)',
    nameEn: 'Start at Standard A0 (Key 1 = A0)',
    refKeyIndex: 0,
    refFreqHz: 27.5,
    noteLabel: 'La0 · 27.50 Hz',
    descEs: 'Hipótesis extrema: conserva el grave profundo pero recorta el agudo en Sol5 (27.50 – 783.99 Hz).',
    descEn: 'Extreme hypothesis: preserves deep bass but caps treble at G5 (27.50 – 783.99 Hz).',
  },
];

const NOTE_NAMES_ES = ['Do', 'Do♯', 'Re', 'Mi♭', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'Si♭', 'Si'];
const NOTE_NAMES_EN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];
const BLACK_PITCH_CLASSES = new Set([1, 3, 6, 8, 10]);

export function midiToName(midi: number, lang: 'es' | 'en' = 'es'): string {
  const pc = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  return `${(lang === 'es' ? NOTE_NAMES_ES : NOTE_NAMES_EN)[pc]}${oct}`;
}

/**
 * Computes physical inharmonicity coefficient B(f0) for a compact Carl Sauter baby grand (~165-185 cm).
 * In 18-EDO (58 Hz – 1661 Hz), B stays smoothly between ~0.00018 and ~0.00373.
 * In 12-EDO (27.5 Hz – 4186 Hz), B rises steeply at both ends (~0.00055 at A0, ~0.01842 at C8).
 */
export function computeInharmonicityB(freqHz: number): number {
  const f = Math.max(25, Math.min(4500, freqHz));
  // Smooth physical curve calibrated to the research doc values:
  // A0 (27.5Hz) ~ 0.00055, Bb1 (58.3Hz) ~ 0.00018, C4 (261.6Hz) ~ 0.00035,
  // G#6 (1661Hz) ~ 0.00373, C8 (4186Hz) ~ 0.01842
  const trebleTerm = 0.00022 * Math.pow(f / 261.63, 1.54);
  const bassWoundTerm = f < 95 ? 0.00048 * Math.pow((95 - f) / 67.5, 2.1) : 0;
  return Math.min(0.025, Math.max(0.00012, 0.00013 + trebleTerm + bassWoundTerm));
}

/**
 * Railsback octave stretching in cents based on frequency and stretch factor (0..1.5)
 */
export function computeRailsbackCents(freqHz: number, stretchAmount: number): number {
  if (stretchAmount <= 0) return 0;
  const octFromC4 = Math.log2(freqHz / 261.625565);
  // Mild cubic stretch consistent with compact baby grand inharmonicity
  const rawCents = 0.55 * octFromC4 * Math.abs(octFromC4) * Math.abs(octFromC4);
  return Math.max(-28, Math.min(35, rawCents * stretchAmount));
}

export function buildKeyboardLayout(
  variantId: VariantId,
  anchorId: AnchorId,
  railsbackStretch = 1.0,
  lang: 'es' | 'en' = 'es'
): KeyInfo[] {
  const variant = VARIANTS[variantId];
  const anchor = ANCHOR_PRESETS.find((a) => a.id === anchorId) ?? ANCHOR_PRESETS[0];

  const keys: KeyInfo[] = [];

  for (let i = 0; i < variant.numKeys; i++) {
    const midiVisual = variant.firstMidiVisual + i;
    const isBlack = BLACK_PITCH_CLASSES.has(((midiVisual % 12) + 12) % 12);

    let baseFreqHz: number;
    if (variantId === 'dieciseisavos') {
      // 96-EDO spans exactly 1 octave from C4 (261.6256 Hz) to C5 (523.25 Hz)
      baseFreqHz = 261.625565 * Math.pow(2, i / 96);
    } else if (variantId === 'tonos-enteros') {
      // 43 keys in 6-EDO starting at C2 (65.41 Hz) up to C9-ish, or anchored at C4 (key 13)
      baseFreqHz = 65.406391 * Math.pow(2, i / 6);
    } else if (variantId === 'estandar') {
      // Standard 12-EDO A4 = 440 Hz on key index 48 (MIDI 69)
      baseFreqHz = 440.0 * Math.pow(2, (i - 48) / 12);
    } else {
      // 18-EDO or 24-EDO using selected anchor
      const stepsFromRef = i - anchor.refKeyIndex;
      baseFreqHz = anchor.refFreqHz * Math.pow(2, stepsFromRef / variant.edo);
    }

    const railsback = computeRailsbackCents(baseFreqHz, railsbackStretch);
    const freqHz = baseFreqHz * Math.pow(2, railsback / 1200);
    const inharmonicityB = computeInharmonicityB(freqHz);

    // Carrillo numerical notation relative to C4 (261.6256 Hz)
    const stepsFromC4 = Math.round(Math.log2(baseFreqHz / 261.625565) * variant.edo);
    const carrilloStep = ((stepsFromC4 % variant.edo) + variant.edo) % variant.edo;
    const carrilloOctave = 4 + Math.floor(stepsFromC4 / variant.edo);
    const carrillo90 = variant.edo === 18 ? carrilloStep * 5 : null;

    // Nearest 12-EDO note
    const midiFloat = 69 + 12 * Math.log2(freqHz / 440);
    const nearestMidi = Math.round(midiFloat);
    const centsFromNearest12 = Math.round((midiFloat - nearestMidi) * 100);

    keys.push({
      index: i,
      keyNumber: i + 1,
      midiVisual,
      isBlack,
      visualName: midiToName(midiVisual, lang),
      freqHz,
      inharmonicityB,
      carrilloStep,
      carrilloOctave,
      carrillo90,
      nearest12Name: midiToName(nearestMidi, lang),
      centsFromNearest12,
    });
  }

  return keys;
}

/**
 * Generates Scala (.scl) file content for the selected EDO
 */
export function generateScalaScl(variantId: VariantId): string {
  const v = VARIANTS[variantId];
  const lines = [
    `! sonido13_${v.id}.scl`,
    `! Julián Carrillo - ${v.nameEs} (${v.edo}-EDO) - Sonido 13 Piano Virtual`,
    `Julián Carrillo ${v.edo}-EDO (${v.nameEn})`,
    ` ${v.edo}`,
    `!`,
  ];
  for (let i = 1; i <= v.edo; i++) {
    const cents = (i * 1200) / v.edo;
    lines.push(` ${cents.toFixed(4)}`);
  }
  return lines.join('\n') + '\n';
}

/**
 * Generates Scala Keyboard Mapping (.kbm) file content for the selected anchor
 */
export function generateScalaKbm(variantId: VariantId, anchorId: AnchorId): string {
  const v = VARIANTS[variantId];
  const anchor = ANCHOR_PRESETS.find((a) => a.id === anchorId) ?? ANCHOR_PRESETS[0];
  const refMidi = v.firstMidiVisual + anchor.refKeyIndex;
  return [
    `! sonido13_${v.id}_${anchor.id}.kbm`,
    `! Mapping for ${v.nameEn} anchored at ${anchor.noteLabel}`,
    `0`,
    `0`,
    `127`,
    `${refMidi}`,
    `${refMidi}`,
    `${anchor.refFreqHz.toFixed(4)}`,
    `${v.edo}`,
  ].join('\n') + '\n';
}
