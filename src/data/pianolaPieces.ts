import { VariantId } from '../audio/tuning';

export interface PianolaEvent {
  timeSec: number;
  durationSec: number;
  keyIndex: number; // 0-based on keyboard (index 39 = Key 40 / C4 on 88-key)
  velocity: number; // 0.1..1.0
  sustain?: boolean;
  labelEs?: string; // Live didactic annotation shown in the fixed-height ticker!
  labelEn?: string;
}

export interface PieceBadges {
  system: string;
  yearRef: string;
  keyIntervalsEs: string;
  keyIntervalsEn: string;
  carrilloFormula: string;
}

export interface PianolaPiece {
  id: string;
  shortEs: string;
  shortEn: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  listenForEs: string;
  listenForEn: string;
  historicalContextEs: string;
  historicalContextEn: string;
  acousticAnalysisEs: string;
  acousticAnalysisEn: string;
  listeningExperimentEs: string;
  listeningExperimentEn: string;
  badges: PieceBadges;
  bpm: number;
  durationSec: number;
  recommendedVariant: VariantId;
  events: PianolaEvent[];
}

// 1. Concertino en Tercios de Tono (1958) — Homage to Carrillo & Bernard de Flavigny
function buildConcertino(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  const intro: Array<[number, number, number, number, string?, string?]> = [
    [0.2, 2.6, 21, 0.76, 'Lento: Octava grave Do3 (Carrillo 0)', 'Lento: Bass octave C3 (Carrillo 0)'],
    [0.25, 2.5, 39, 0.72],
    [0.9, 0.7, 44, 0.64, 'Tercera neutra (+5 tercios = 333.3¢)', 'Neutral third (+5 steps = 333.3¢)'],
    [1.6, 0.7, 47, 0.68, 'Undécima armónica (+8 tercios = 533.3¢)', 'Harmonic 11th (+8 steps = 533.3¢)'],
    [2.3, 1.4, 57, 0.80, 'Octava real 2:1 (+18 teclas)', 'True 2:1 octave (+18 keys)'],
    [3.8, 0.45, 56, 0.65, 'Inflexión melódica de tercio de tono (66.7¢)', 'Third-tone melodic inflection (66.7¢)'],
    [4.25, 0.45, 55, 0.62],
    [4.7, 0.5, 54, 0.66],
    [5.2, 0.55, 52, 0.68],
    [5.75, 1.5, 50, 0.74],
    [5.75, 1.5, 39, 0.64],
    [5.75, 1.5, 21, 0.70],
  ];
  for (const [t, d, k, v, lEs, lEn] of intro) {
    ev.push({ timeSec: t, durationSec: d, keyIndex: k, velocity: v, sustain: true, labelEs: lEs, labelEn: lEn });
  }

  let t = 7.5;
  const runUp = [21, 27, 33, 39, 44, 47, 52, 57, 62, 65, 70, 75];
  runUp.forEach((k, i) => {
    ev.push({
      timeSec: t + i * 0.16,
      durationSec: 0.55,
      keyIndex: k,
      velocity: 0.6 + (i / runUp.length) * 0.26,
      sustain: i === 0,
      labelEs: i === 0 ? 'Allegro: Arpegio expandido en 4 octavas de 18-EDO' : undefined,
      labelEn: i === 0 ? 'Allegro: Expanded arpeggio across 4 octaves of 18-EDO' : undefined,
    });
  });
  t += runUp.length * 0.16 + 0.3;

  const ostinatoChords = [
    { bass: 24, mid: [42, 47, 50], mel: [60, 59, 58, 57, 59, 60] },
    { bass: 27, mid: [45, 50, 53], mel: [63, 62, 61, 60, 62, 65] },
    { bass: 21, mid: [39, 44, 47], mel: [66, 65, 63, 62, 60, 57] },
  ];
  for (const grp of ostinatoChords) {
    ev.push({ timeSec: t, durationSec: 2.1, keyIndex: grp.bass, velocity: 0.76, sustain: true });
    grp.mid.forEach((m, idx) => {
      ev.push({ timeSec: t + 0.18 + idx * 0.05, durationSec: 1.8, keyIndex: m, velocity: 0.56 });
    });
    grp.mel.forEach((n, idx) => {
      ev.push({
        timeSec: t + 0.3 + idx * 0.3,
        durationSec: 0.36,
        keyIndex: n,
        velocity: 0.68 + (idx % 2) * 0.08,
        labelEs: idx === 0 ? 'Canto solista en grados conjuntos de 66.7 cents' : undefined,
        labelEn: idx === 0 ? 'Soloist cantabile in 66.7-cent conjunct steps' : undefined,
      });
    });
    t += 2.25;
  }

  [21, 39, 45, 57, 63, 75].forEach((k, i) => {
    ev.push({
      timeSec: t + i * 0.07,
      durationSec: 3.2,
      keyIndex: k,
      velocity: 0.78,
      sustain: true,
      labelEs: i === 0 ? 'Cadencia final: Octavas puras (+18, +36) y décima mayor (+24)' : undefined,
      labelEn: i === 0 ? 'Final cadence: Pure octaves (+18, +36) & major tenth (+24)' : undefined,
    });
  });
  return ev;
}

// 2. Metamorfosis I: J. S. Bach — Prelude in C Major (BWV 846)
function buildBachMetamorfosis(): PianolaEvent[] {
  const measures: Array<{ notes: [number, number, number, number, number]; labelEs?: string; labelEn?: string }> = [
    {
      notes: [39, 43, 46, 51, 55],
      labelEs: 'Compás 1 (Do-Mi-Sol-Do-Mi visual): en 18-EDO la "octava" de 12 teclas mide 800¢',
      labelEn: 'Bar 1 (visual C-E-G-C-E): in 18-EDO the 12-key "octave" spans 800¢',
    },
    { notes: [39, 41, 48, 53, 56] },
    {
      notes: [38, 41, 46, 53, 56],
      labelEs: 'Compás 3 (Sol7/Si visual): el tritono clásico se transforma en cuarta neutra',
      labelEn: 'Bar 3 (visual G7/B): the classic tritone transforms into a neutral fourth',
    },
    { notes: [39, 43, 46, 51, 55] },
    {
      notes: [39, 43, 48, 55, 60],
      labelEs: 'Compás 5 (La menor/Do visual): se expande hacia el registro medio-agudo de 18-EDO',
      labelEn: 'Bar 5 (visual Am/C): opens into the luminous upper-middle register of 18-EDO',
    },
    { notes: [39, 41, 45, 48, 53] },
    { notes: [38, 41, 46, 53, 58] },
    { notes: [38, 40, 43, 46, 51] },
    { notes: [36, 40, 43, 48, 51] },
    { notes: [33, 38, 41, 45, 50] },
    {
      notes: [34, 38, 41, 46, 50],
      labelEs: 'Pulsa "⇄ A/B: 18-EDO ↔ 12-EDO" arriba para comparar con Bach original al instante',
      labelEn: 'Click "⇄ A/B: 18-EDO ↔ 12-EDO" above to compare with original Bach in real time',
    },
  ];

  const ev: PianolaEvent[] = [];
  let t = 0.2;
  const s = 0.165;
  for (const m of measures) {
    const [n0, n1, n2, n3, n4] = m.notes;
    for (let rep = 0; rep < 2; rep++) {
      ev.push({
        timeSec: t,
        durationSec: s * 7.8,
        keyIndex: n0,
        velocity: 0.72,
        sustain: true,
        labelEs: rep === 0 ? m.labelEs : undefined,
        labelEn: rep === 0 ? m.labelEn : undefined,
      });
      ev.push({ timeSec: t + s * 1, durationSec: s * 6.8, keyIndex: n1, velocity: 0.62 });
      const fig = [n2, n3, n4, n2, n3, n4];
      fig.forEach((k, idx) => {
        ev.push({
          timeSec: t + s * (2 + idx),
          durationSec: s * 1.4,
          keyIndex: k,
          velocity: 0.56 + (idx % 3 === 0 ? 0.09 : 0),
        });
      });
      t += s * 8;
    }
  }
  [27, 39, 43, 46, 51, 55].forEach((k, i) => {
    ev.push({ timeSec: t + i * 0.05, durationSec: 2.8, keyIndex: k, velocity: 0.74, sustain: true });
  });
  return ev;
}

// 3. Preludio a Colón — Evocación (1922)
function buildPreludioAColon(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  let t = 0.25;
  const phrases = [
    { bass: 15, arp: [39, 46, 53, 63, 53, 46], voc: [63, 64, 65, 66, 65, 64, 63] },
    { bass: 19, arp: [43, 50, 57, 67, 57, 50], voc: [67, 68, 69, 70, 71, 69, 67] },
    { bass: 15, arp: [39, 47, 55, 63, 55, 47], voc: [72, 71, 70, 69, 68, 66, 63] },
  ];

  phrases.forEach((p, pIdx) => {
    ev.push({
      timeSec: t,
      durationSec: 4.8,
      keyIndex: p.bass,
      velocity: 0.68,
      sustain: true,
      labelEs:
        pIdx === 0
          ? 'Evocación de 1922: arpegios cristalinos y vocalise deslizante en cuartos de tono (50¢)'
          : pIdx === 2
            ? 'Descenso cromático microinterválico (pasos continuos de 1/4 de tono)'
            : undefined,
      labelEn:
        pIdx === 0
          ? '1922 Evocation: crystalline arpeggios & sliding quarter-tone vocalise (50¢)'
          : pIdx === 2
            ? 'Micro-intervallic descending line (continuous 1/4-tone steps)'
            : undefined,
    });
    for (let cycle = 0; cycle < 2; cycle++) {
      p.arp.forEach((k, i) => {
        ev.push({
          timeSec: t + cycle * 2.4 + i * 0.38,
          durationSec: 0.9,
          keyIndex: k,
          velocity: 0.48 + (i === 3 ? 0.12 : 0),
        });
      });
    }
    p.voc.forEach((k, i) => {
      ev.push({
        timeSec: t + 0.5 + i * 0.6,
        durationSec: 0.72,
        keyIndex: k,
        velocity: 0.74,
      });
    });
    t += 5.0;
  });

  [15, 39, 47, 55, 63].forEach((k, i) => {
    ev.push({ timeSec: t + i * 0.08, durationSec: 3.0, keyIndex: k, velocity: 0.66, sustain: true });
  });
  return ev;
}

// 4. Balbuceos — Desintegración del Tono (1958)
function buildBalbuceos96(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  let t = 0.2;
  for (let i = 0; i <= 24; i++) {
    ev.push({
      timeSec: t + i * 0.09,
      durationSec: 0.45,
      keyIndex: i,
      velocity: 0.55 + (i / 24) * 0.25,
      sustain: i === 0,
      labelEs: i === 0 ? '96-EDO: ¡24 teclas recorren apenas una tercera menor (12.5¢ por tecla)!' : undefined,
      labelEn: i === 0 ? '96-EDO: 24 keys span just one minor third (12.5¢ per key)!' : undefined,
    });
  }
  t += 25 * 0.09 + 0.4;

  const clusters = [
    [32, 34, 36],
    [48, 50, 53],
    [64, 67, 70],
  ];
  clusters.forEach((cl, idx) => {
    cl.forEach((k, j) => {
      ev.push({
        timeSec: t + j * 0.08,
        durationSec: 1.7,
        keyIndex: k,
        velocity: 0.72,
        sustain: true,
        labelEs:
          idx === 0 && j === 0
            ? 'Clústeres de dieciseisavos de tono: escucha los batimientos acústicos lentos (2–5 Hz)'
            : undefined,
        labelEn:
          idx === 0 && j === 0
            ? 'Sixteenth-tone clusters: hear the slow acoustic beating waves (2–5 Hz)'
            : undefined,
      });
    });
    t += 1.85;
  });

  for (let i = 0; i < 96; i += 2) {
    ev.push({
      timeSec: t + (i / 2) * 0.055,
      durationSec: 0.5,
      keyIndex: i,
      velocity: 0.52 + (i / 96) * 0.34,
      sustain: true,
      labelEs: i === 0 ? 'Barrido continuo del teclado completo (Do4 → Do5 en una sola octava)' : undefined,
      labelEn: i === 0 ? 'Continuous sweep across the entire keyboard (C4 → C5 in a single octave)' : undefined,
    });
  }
  t += 48 * 0.055 + 0.3;
  [0, 32, 56, 95].forEach((k, i) => {
    ev.push({ timeSec: t + i * 0.06, durationSec: 3.0, keyIndex: k, velocity: 0.78, sustain: true });
  });
  return ev;
}

// 5. Metamorfosis II: Claro de Luna (Beethoven, Op. 27 No. 2)
function buildMoonlightMetamorfosis(): PianolaEvent[] {
  const bars: Array<{ bass: [number, number]; trip: [number, number, number]; mel?: number; labelEs?: string; labelEn?: string }> = [
    {
      bass: [16, 28],
      trip: [35, 40, 43],
      labelEs: 'Ostinato de Beethoven en 18-EDO: las octavas del bajo (12 teclas) se vuelven sextas menores',
      labelEn: 'Beethoven ostinato in 18-EDO: the 12-key bass octaves become minor sixths (800¢)',
    },
    { bass: [15, 27], trip: [35, 40, 43] },
    {
      bass: [12, 24],
      trip: [36, 40, 45],
      labelEs: 'La tríada menor visual (3+4 teclas) suena como 200¢ + 266.7¢ (color modal inédito)',
      labelEn: 'The visual minor triad (3+4 keys) sounds as 200¢ + 266.7¢ (unheard modal color)',
    },
    { bass: [9, 21], trip: [33, 38, 42] },
    { bass: [11, 23], trip: [35, 39, 44], mel: 51 },
    {
      bass: [16, 28],
      trip: [35, 40, 43],
      mel: 52,
      labelEs: 'Entrada del canto fúnebre metamorfoseado en el registro medio',
      labelEn: 'Entry of the metamorphosed cantabile melody in the middle register',
    },
  ];

  const ev: PianolaEvent[] = [];
  let t = 0.2;
  const tripDur = 0.27;
  for (const b of bars) {
    ev.push({
      timeSec: t,
      durationSec: tripDur * 11.6,
      keyIndex: b.bass[0],
      velocity: 0.72,
      sustain: true,
      labelEs: b.labelEs,
      labelEn: b.labelEn,
    });
    ev.push({ timeSec: t + 0.03, durationSec: tripDur * 11.6, keyIndex: b.bass[1], velocity: 0.66 });

    for (let beat = 0; beat < 4; beat++) {
      b.trip.forEach((k, idx) => {
        ev.push({
          timeSec: t + (beat * 3 + idx) * tripDur,
          durationSec: tripDur * 1.4,
          keyIndex: k,
          velocity: 0.44 + idx * 0.04,
        });
      });
    }
    if (b.mel !== undefined) {
      ev.push({ timeSec: t + tripDur * 9, durationSec: tripDur * 2.5, keyIndex: b.mel, velocity: 0.76 });
      ev.push({ timeSec: t + tripDur * 11.2, durationSec: tripDur * 0.9, keyIndex: b.mel, velocity: 0.70 });
    }
    t += tripDur * 12;
  }
  [16, 28, 35, 40, 43, 52].forEach((k, i) => {
    ev.push({ timeSec: t + i * 0.06, durationSec: 3.0, keyIndex: k, velocity: 0.68, sustain: true });
  });
  return ev;
}

// 6. Estudio de Terceras Neutras (11:9) y Undécima Armónica (11:8)
function buildNeutralStudy(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  const roots = [
    { r: 21, labelEs: 'Acorde neutro sobre Do (0 - 5 - 11 - 18): tercera neutra pura 11:9', labelEn: 'Neutral chord on C (0 - 5 - 11 - 18): pure 11:9 neutral third' },
    { r: 24, labelEs: 'Modulación por tono entero (+3 pasos = 200¢ exactos)', labelEn: 'Whole-tone modulation (+3 steps = exact 200¢)' },
    { r: 29, labelEs: 'Color de undécima armónica (11:8 = +8 pasos, 533.3¢)', labelEn: 'Harmonic eleventh color (11:8 = +8 steps, 533.3¢)' },
    { r: 21, labelEs: 'Resolución espectral en 18-EDO', labelEn: 'Spectral resolution in 18-EDO' },
  ];

  let t = 0.2;
  const step = 0.26;
  roots.forEach((item, idx) => {
    const r = item.r;
    const pat =
      idx === 2
        ? [r + 18, r + 23, r + 26, r + 36, r + 41, r + 36, r + 26, r + 23]
        : [r + 18, r + 23, r + 29, r + 36, r + 41, r + 36, r + 29, r + 23];

    ev.push({
      timeSec: t,
      durationSec: step * 7.8,
      keyIndex: r,
      velocity: 0.74,
      sustain: true,
      labelEs: item.labelEs,
      labelEn: item.labelEn,
    });
    pat.forEach((k, i) => {
      ev.push({
        timeSec: t + i * step,
        durationSec: step * 1.6,
        keyIndex: k,
        velocity: 0.56 + (i === 4 ? 0.18 : 0),
      });
    });
    t += pat.length * step;
  });

  [21, 39, 44, 47, 57, 62].forEach((k, i) => {
    ev.push({ timeSec: t + i * 0.07, durationSec: 3.0, keyIndex: k, velocity: 0.72, sustain: true });
  });
  return ev;
}

// 7. Prisma Hexagonal — Tonos Enteros (6-EDO, 43 teclas)
function buildWholeTonePrisma(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  let t = 0.2;
  ev.push({
    timeSec: t,
    durationSec: 3.5,
    keyIndex: 6,
    velocity: 0.76,
    sustain: true,
    labelEs: 'Piano de 43 teclas (6-EDO): ¡cada 6 teclas completas una octava entera!',
    labelEn: '43-key Whole-Tone Piano (6-EDO): every 6 keys span a full octave!',
  });

  const waves = [
    [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    [26, 25, 24, 22, 20, 18, 16, 14, 12, 14, 16, 18, 20],
    [9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 30],
  ];
  waves.forEach((w, wIdx) => {
    if (wIdx > 0) {
      ev.push({
        timeSec: t,
        durationSec: 2.6,
        keyIndex: wIdx === 1 ? 8 : 6,
        velocity: 0.72,
        sustain: true,
        labelEs: wIdx === 2 ? 'Una mano abarca aquí casi 3 octavas reales sin esfuerzo' : undefined,
        labelEn: wIdx === 2 ? 'One hand easily spans nearly 3 real octaves on this keyboard' : undefined,
      });
    }
    w.forEach((k, i) => {
      ev.push({
        timeSec: t + i * 0.17,
        durationSec: 0.55,
        keyIndex: k,
        velocity: 0.55 + (i / w.length) * 0.24,
      });
    });
    t += w.length * 0.17 + 0.35;
  });

  [6, 12, 14, 16, 18, 24, 30].forEach((k, i) => {
    ev.push({ timeSec: t + i * 0.06, durationSec: 3.0, keyIndex: k, velocity: 0.74, sustain: true });
  });
  return ev;
}

// 8. Horizontes — Coral Microinterválico (24-EDO)
function buildHorizontesCoral(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  const chords: Array<{ notes: number[]; labelEs?: string; labelEn?: string }> = [
    {
      notes: [27, 39, 47, 53],
      labelEs: 'Coral a 4 voces: conducción de voces por cuartos de tono (50¢)',
      labelEn: '4-voice chorale: voice-leading by 50-cent quarter-tones',
    },
    { notes: [27, 40, 46, 54] },
    {
      notes: [26, 41, 45, 55],
      labelEs: 'Movimiento contrario cromático ultrafino (imposible en 12-EDO)',
      labelEn: 'Ultra-fine chromatic contrary motion (impossible in 12-EDO)',
    },
    { notes: [25, 41, 47, 57] },
    { notes: [23, 39, 48, 56] },
    {
      notes: [15, 39, 47, 63],
      labelEs: 'Cadencia abierta con octava pura (+24 teclas en 24-EDO)',
      labelEn: 'Open cadence with pure octave (+24 keys in 24-EDO)',
    },
  ];

  let t = 0.25;
  for (const c of chords) {
    c.notes.forEach((k, i) => {
      ev.push({
        timeSec: t + i * 0.05,
        durationSec: 2.1,
        keyIndex: k,
        velocity: 0.64 + (i === 3 ? 0.12 : 0),
        sustain: true,
        labelEs: i === 0 ? c.labelEs : undefined,
        labelEn: i === 0 ? c.labelEn : undefined,
      });
    });
    t += 2.25;
  }
  return ev;
}

// 9. Espejos Simpáticos
function buildSympatheticTest(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  let t = 0.2;
  ev.push({
    timeSec: t,
    durationSec: 11.5,
    keyIndex: 21,
    velocity: 0.58,
    sustain: true,
    labelEs: 'Pedal sostenido sobre Do3: escuchando cómo responde el arpa Sauter',
    labelEn: 'Sustain held on C3: listening to how the Sauter harp responds',
  });
  t += 1.2;

  const pings: Array<[number, string, string]> = [
    [39, 'Ping +18 teclas (Octava 2:1): acoplamiento simpático máximo en 18-EDO', 'Ping +18 keys (2:1 Octave): peak sympathetic coupling in 18-EDO'],
    [45, 'Ping +24 teclas (Décima mayor 5:2): segundo acoplamiento real del 18-EDO', 'Ping +24 keys (Major 10th 5:2): second real coupling of 18-EDO'],
    [50, 'Ping +29 teclas (Cuasi-duodécima 733¢): en 18-EDO NO hay resonancia de quinta justa', 'Ping +29 keys (Quasi-12th 733¢): no perfect-fifth resonance in 18-EDO'],
    [57, 'Ping +36 teclas (Doble octava 4:1): halo cristalino sin nube de quintas', 'Ping +36 keys (Double octave 4:1): crystalline halo without fifth cloud'],
  ];

  for (const [k, lEs, lEn] of pings) {
    ev.push({
      timeSec: t,
      durationSec: 0.18,
      keyIndex: k,
      velocity: 0.88,
      sustain: true,
      labelEs: lEs,
      labelEn: lEn,
    });
    t += 2.5;
  }
  return ev;
}

// 10. Escala Maestra del Sonido 13
function buildGuidedTour18(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  let t = 0.25;
  for (let s = 0; s <= 18; s++) {
    ev.push({
      timeSec: t,
      durationSec: 0.3,
      keyIndex: 39 + s,
      velocity: s === 0 || s === 18 ? 0.84 : 0.64,
      labelEs:
        s === 0
          ? 'Paso 1: Escala completa de 18 tercios de tono (Do4 = 0 hasta Do5 = 18)'
          : s === 12
            ? 'Tecla +12 (800¢): aquí terminaría la octava en un piano normal; faltan 6 teclas más'
            : s === 18
              ? 'Tecla +18 (1200¢): ¡Octava real alcanzada!'
              : undefined,
      labelEn:
        s === 0
          ? 'Step 1: Complete 18-step third-tone scale (C4 = 0 up to C5 = 18)'
          : s === 12
            ? 'Key +12 (800¢): a standard piano octave ends here; 6 more keys to go!'
            : s === 18
              ? 'Key +18 (1200¢): True 2:1 octave reached!'
              : undefined,
    });
    t += 0.25;
  }
  t += 0.55;

  [0, 3, 6, 9, 12, 15, 18].forEach((s, idx) => {
    ev.push({
      timeSec: t,
      durationSec: 0.42,
      keyIndex: 39 + s,
      velocity: 0.74,
      sustain: true,
      labelEs: idx === 0 ? 'Paso 2: Escala de tonos enteros intacta (cada 3 tercios = 200¢ exactos)' : undefined,
      labelEn: idx === 0 ? 'Step 2: Intact whole-tone scale (every 3 third-tones = exact 200¢)' : undefined,
    });
    t += 0.34;
  });
  t += 0.55;

  const demoChords: Array<[number[], string, string]> = [
    [[39, 44, 50, 57], 'Acorde Neutro (0-5-11-18): tercera neutra 11:9 característica del 18-EDO', 'Neutral Chord (0-5-11-18): signature 11:9 neutral third of 18-EDO'],
    [[39, 45, 47, 57], 'Acorde Espectral (0-6-8-18): tercera mayor + undécima armónica 11:8', 'Spectral Chord (0-6-8-18): major third + 11:8 harmonic eleventh'],
  ];
  for (const [notes, lEs, lEn] of demoChords) {
    notes.forEach((k, i) => {
      ev.push({
        timeSec: t + i * 0.05,
        durationSec: 1.8,
        keyIndex: k,
        velocity: 0.76,
        sustain: true,
        labelEs: i === 0 ? lEs : undefined,
        labelEn: i === 0 ? lEn : undefined,
      });
    });
    t += 2.0;
  }
  return ev;
}

export const PIANOLA_PIECES: PianolaPiece[] = [
  {
    id: 'concertino-1958',
    shortEs: '1 · Concertino',
    shortEn: '1 · Concertino',
    titleEs: '1 · Concertino en Tercios de Tono (1958)',
    titleEn: '1 · Concertino in Third-Tones (1958)',
    descEs: 'Estudio concertante en dos secciones (Lento misterioso – Allegro metamórfico) inspirado en el Concertino grabado en París para Philips.',
    descEn: 'Two-part concertante étude (Lento misterioso – Allegro metamórfico) inspired by the Concertino recorded in Paris for Philips.',
    listenForEs: 'Observa cómo las octavas exigen 18 teclas y cómo el canto solista respira en micro-pasos de 66.7 cents.',
    listenForEn: 'Watch how true octaves span 18 keys while the soloist cantabile breathes in 66.7-cent micro-steps.',
    historicalContextEs:
      'En 1958, tras exhibir sus 15 pianos Carl Sauter en la Exposición Universal de Bruselas, Julián Carrillo dirigió en París a la Orchestre des Concerts Lamoureux con el pianista francés Bernard de Flavigny como solista en el Concertino en tercios de tono (movimientos Lento, Allegro y Vivace). Es el documento fonográfico esencial para conocer el articulado real del media cola de 18-EDO.',
    historicalContextEn:
      'In 1958, after exhibiting his 15 Carl Sauter pianos at the Brussels World’s Fair, Julián Carrillo conducted the Orchestre des Concerts Lamoureux in Paris with pianist Bernard de Flavigny in the Concertino in Third-Tones (Lento, Allegro, Vivace)—the primary recorded testimony of the 18-EDO baby grand.',
    acousticAnalysisEs:
      'La sección inicial yuxtapone el ancla de octava pura (+18 teclas, 1200¢) con la tercera neutra (+5 teclas = 333.3¢, error de apenas −14¢ respecto a la razón justa 11:9) y la undécima natural (+8 teclas = 533.3¢ ≈ 11:8). En el Allegro, los arpegios recorren cuatro octavas mostrando la baja inarmonicidad B del encordado comprimido.',
    acousticAnalysisEn:
      'The opening juxtaposes a pure octave (+18 keys, 1200¢) against the neutral third (+5 keys = 333.3¢, just −14¢ from pure 11:9) and the harmonic eleventh (+8 keys = 533.3¢ ≈ 11:8). In the Allegro, sweeping four-octave arpeggios highlight the low, homogeneous inharmonicity B of the compressed string scale.',
    listeningExperimentEs:
      'Prueba reducir "Anchura de unísono" a 15% y luego subirla a 80% durante el canto agudo (seg. 11–16): notarás por qué un unísono estrecho es vital cerca del pico de aspereza sensorial (~0.25 CBW).',
    listeningExperimentEn:
      'Try lowering "Unison Width" to 15% vs. raising it to 80% during the upper cantabile (11–16s) to hear why tight unisons are vital near peak psychoacoustic roughness (~0.25 CBW).',
    badges: {
      system: '18-EDO · 66.7¢',
      yearRef: 'París / Bruselas, 1958',
      keyIntervalsEs: '11:9 (+5), 11:8 (+8), 2:1 (+18)',
      keyIntervalsEn: '11:9 (+5), 11:8 (+8), 2:1 (+18)',
      carrilloFormula: '0 – 5 – 8 – 18 (Escala 90: 0–25–40–90)',
    },
    bpm: 96,
    durationSec: 20.5,
    recommendedVariant: 'tercios',
    events: buildConcertino(),
  },
  {
    id: 'metamorfosis-bach',
    shortEs: '2 · Bach Metamorf.',
    shortEn: '2 · Bach Metamorph.',
    titleEs: '2 · Metamorfosis I: Preludio en Do Mayor (J. S. Bach, BWV 846)',
    titleEn: '2 · Metamorphosis I: Prelude in C Major (J. S. Bach, BWV 846)',
    descEs: 'Las teclas físicas exactas del Preludio I de El clave bien temperado ejecutadas literalmente sobre el teclado de tercios de tono.',
    descEn: 'The exact physical keys of Book I’s Prelude in C from The Well-Tempered Clavier played literally on the third-tone keyboard.',
    listenForEs: 'Alterna el botón "⇄ A/B" mientras suena para oír cómo la armonía barroca se comprime a 2/3 de su tamaño.',
    listenForEn: 'Toggle "⇄ A/B" mid-playback to hear baroque harmony compress geometrically to 2/3 of its span.',
    historicalContextEs:
      'En su tratado Leyes de metamorfosis musicales (1949), Carrillo propuso transformar obras maestras clásicas —especialmente de J. S. Bach— multiplicando o dividiendo proporcionalmente todos sus intervalos. Los pianos Sauter materializaron esa idea mecánicamente: el intérprete lee la partitura tradicional de Bach sin cambiar un solo dedo, y el teclado realiza la transformación matemática.',
    historicalContextEn:
      'In his 1949 treatise Laws of Musical Metamorphosis, Carrillo proposed transforming classical masterworks—especially J. S. Bach—by scaling all intervals proportionally. The Sauter pianos mechanized this: a pianist reads Bach’s standard score without changing a single finger while the keyboard executes the mathematical transformation.',
    acousticAnalysisEs:
      'Toda distancia en cents se multiplica por 2/3 (factor 0.6667): el primer acorde visual Do4–Mi4–Sol4–Do5–Mi5 (0–4–7–12–16 teclas) pasa de 0–400–700–1200–1600¢ a 0–266.7–466.7–800–1066.7¢. La octava visual se convierte en sexta menor (800¢) y la tercera mayor visual en una tercera submenor septimal (~7:6, 266.7¢).',
    acousticAnalysisEn:
      'Every interval in cents is multiplied by 2/3 (0.6667): the opening visual C4–E4–G4–C5–E5 shape (0–4–7–12–16 keys) maps from 0–400–700–1200–1600¢ to 0–266.7–466.7–800–1066.7¢. Visual octaves become minor sixths (800¢) and visual major thirds become septimal subminor thirds (~7:6, 266.7¢).',
    listeningExperimentEs:
      'Observa el Círculo Armónico de la derecha mientras pulsas "⇄ A/B": verás cómo el polígono del acorde pasa de cerrarse en la octava (12-EDO) a espiralar abiertamente por el reloj de 18 grados.',
    listeningExperimentEn:
      'Watch the Pitch-Class Circle on the right while clicking "⇄ A/B": see how the chord polygon shifts from octave closure in 12-EDO to an open spiral in 18-EDO.',
    badges: {
      system: 'Metamorfosis × 2/3',
      yearRef: 'Tratado de 1949 / BWV 846',
      keyIntervalsEs: '4 teclas = 267¢ (~7:6), 12 teclas = 800¢',
      keyIntervalsEn: '4 keys = 267¢ (~7:6), 12 keys = 800¢',
      carrilloFormula: '0 – 4 – 7 – 12 – 16',
    },
    bpm: 112,
    durationSec: 31.8,
    recommendedVariant: 'tercios',
    events: buildBachMetamorfosis(),
  },
  {
    id: 'preludio-colon',
    shortEs: '3 · Preludio a Colón',
    shortEn: '3 · Prelude to Columbus',
    titleEs: '3 · Preludio a Colón — Evocación Camerística (1922)',
    titleEn: '3 · Prelude to Columbus — Chamber Evocation (1922)',
    descEs: 'Homenaje a la primera composición microinterválica emblemática de Carrillo, escrita en cuartos, octavos y dieciseisavos de tono.',
    descEn: 'Homage to Carrillo’s landmark debut microtonal work, conceived in quarter-, eighth-, and sixteenth-tones.',
    listenForEs: 'En 24-EDO cada tecla avanza 50¢ (cuarto de tono), fundiendo la melodía aguda como una voz humana sin escalones.',
    listenForEn: 'In 24-EDO each key steps 50¢ (quarter-tone), letting the upper melody glide seamlessly like a human voice.',
    historicalContextEs:
      'Compuesto hacia 1922 y estrenado en la Ciudad de México por el Grupo 13 (con soprano, flauta, violín, chelo, arpa y guitarra adaptada a cuartos de tono), Preludio a Colón marcó el nacimiento público mundial de la estética del Sonido 13, impresionando profundamente a Leopold Stokowski en Nueva York.',
    historicalContextEn:
      'Composed around 1922 and premiered in Mexico City by the Grupo 13 ensemble (soprano, flute, strings, harp, and quarter-tone guitar), Preludio a Colón marked the public birth of the Sonido 13 aesthetic and led to collaborations with Leopold Stokowski in New York.',
    acousticAnalysisEs:
      'Se ejecuta aquí en el piano metamorfoseador de Cuartos de Tono (24-EDO, 88 teclas = 3.63 octavas). Como 24 es múltiplo de 12, este piano conserva intactos todos los intervalos tradicionales (quinta = +14 teclas, octava = +24 teclas) pero intercala un sonido exactamente a mitad de cada semitono (50¢).',
    acousticAnalysisEn:
      'Played here on the Quarter-Tone Metamorphoser (24-EDO, 88 keys = 3.63 octaves). Because 24 is a multiple of 12, this piano retains every traditional interval (fifth = +14 keys, octave = +24 keys) while bisecting every semitone into 50-cent steps.',
    listeningExperimentEs:
      'Pisa o mantén el pedal de resonancia y activa el "Una Corda" (tecla Shift): obtendrás la sonoridad velada y etérea característica del arpa y soprano del Preludio original.',
    listeningExperimentEn:
      'Engage the Una Corda pedal (hold Shift) during playback to evoke the veiled, ethereal timbre of the original chamber harp and vocalise.',
    badges: {
      system: '24-EDO · 50.0¢',
      yearRef: 'Grupo Sonido 13, 1922–24',
      keyIntervalsEs: '1/4 de tono (50¢), Octava (+24 teclas)',
      keyIntervalsEn: '1/4-tone (50¢), Octave (+24 keys)',
      carrilloFormula: '0 – 1 – 2 – 3 – 24',
    },
    bpm: 84,
    durationSec: 18.2,
    recommendedVariant: 'cuartos',
    events: buildPreludioAColon(),
  },
  {
    id: 'balbuceos-96',
    shortEs: '4 · Balbuceos (96)',
    shortEn: '4 · Balbuceos (96)',
    titleEs: '4 · Balbuceos — Desintegración del Tono (96-EDO, 1958)',
    titleEn: '4 · Balbuceos — Atomization of Tone (96-EDO, 1958)',
    descEs: 'Estudio inspirado en la obra más radical escrita para el piano Sauter de 96 teclas y dieciseisavos de tono (12.5 cents por tecla).',
    descEn: 'Étude inspired by Carrillo’s most radical work for the 96-key sixteenth-tone Sauter piano (12.5 cents per key).',
    listenForEs: '¡Todo el teclado de 96 teclas cubre una sola octava (Do4–Do5)! Escucha los batimientos lentos de interferencia.',
    listenForEn: 'All 96 keys span a single octave (C4–C5)! Listen to the slow acoustic wave-beating interference.',
    historicalContextEs:
      'Compuesta por encargo para estrenar el célebre piano vertical Carl Sauter de 96 teclas (dieciseisavos de tono) a finales de los años cincuenta, Balbuceos para piano metamorfoseador y orquesta encarna la metáfora favorita de Carrillo: "dividir el tono musical como la física moderna desintegró el átomo".',
    historicalContextEn:
      'Composed in the late 1950s for the flagship 96-key sixteenth-tone Carl Sauter upright, Balbuceos for metamorphoser piano and orchestra embodies Carrillo’s famous metaphor: "splitting the musical whole tone just as modern physics split the atom."',
    acousticAnalysisEs:
      'Con 96 divisiones iguales entre Do4 (261.63 Hz) y Do5 (523.25 Hz), un solo tono entero abarca 16 teclas consecutivas (12.5¢ por paso; Δf ≈ 1.9 Hz cerca de Do4). Al pulsar racimos separados por 2 o 3 teclas (25–37.5¢), las cuerdas no suenan desafinadas sino como una única onda modulada en amplitud por batimientos hipnóticos.',
    acousticAnalysisEn:
      'With 96 equal steps between C4 (261.63 Hz) and C5 (523.25 Hz), a single whole tone spans 16 consecutive keys (12.5¢ per step; Δf ≈ 1.9 Hz near C4). Striking clusters 2–3 keys apart (25–37.5¢) fuses pitches into a single wave pulsing with slow amplitude modulation.',
    listeningExperimentEs:
      'Desactiva "Auto-ajustar piano" y cambia manualmente el selector a "Tercios de Tono (18-EDO)" tras oírla en 96-EDO: el micro-glissando de 1 octava se disparará súbitamente a través de ¡5 octavas enteras!',
    listeningExperimentEn:
      'Uncheck "Auto-select piece’s piano" and switch manually to "18-EDO" after hearing it in 96-EDO: the single-octave micro-sweep suddenly explodes across nearly 5 octaves!',
    badges: {
      system: '96-EDO · 12.5¢',
      yearRef: 'Expo 58 / Sauter 96 teclas',
      keyIntervalsEs: '1/16 de tono (12.5¢), 1 oct = 96 teclas',
      keyIntervalsEn: '1/16-tone (12.5¢), 1 oct = 96 keys',
      carrilloFormula: '0..95 (Do4 → Do5)',
    },
    bpm: 108,
    durationSec: 14.5,
    recommendedVariant: 'dieciseisavos',
    events: buildBalbuceos96(),
  },
  {
    id: 'metamorfosis-beethoven',
    shortEs: '5 · Claro de Luna',
    shortEn: '5 · Moonlight',
    titleEs: '5 · Metamorfosis II: Sonata «Claro de Luna» (Beethoven, Op. 27/2)',
    titleEn: '5 · Metamorphosis II: “Moonlight” Sonata (Beethoven, Op. 27/2)',
    descEs: 'El hipnótico adagio sostenuto de Beethoven ejecutado con su digitación romántica original sobre el piano de tercios de tono.',
    descEn: 'Beethoven’s iconic Adagio sostenuto played with its literal classical fingering on the third-tone metamorphoser.',
    listenForEs: 'La sombría tríada menor de Do♯ menor se transfigura en una luminosa pila de tonos enteros y tercios.',
    listenForEn: 'The somber C♯-minor triad transfigures into a translucent stack of whole tones and third-tones.',
    historicalContextEs:
      'Carrillo insistía en que el sistema temperado de 12 notas había agotado sus combinaciones armónicas hacia finales del Romanticismo. Aplicar las Leyes de metamorfosis a un ícono romántico como el Op. 27 n.º 2 revela cómo la memoria muscular pianística puede engendrar paisajes armónicos completamente nuevos sin alterar el gesto expresivo.',
    historicalContextEn:
      'Carrillo argued that 12-tone equal temperament had exhausted its harmonic combinations after late Romanticism. Applying his Laws of Metamorphosis to Beethoven’s Op. 27 No. 2 reveals how classical muscle memory can unlock entirely new harmonic worlds while preserving expressive phrasing.',
    acousticAnalysisEs:
      'En el tresillo Sol♯3–Do♯4–Mi4 (distancias visuales de +5 y +3 teclas): los +5 semitonos (cuarta justa en 12-EDO) pasan a ser una tercera neutra pura (333.3¢ ≈ 11:9), y los +3 semitonos (tercera menor en 12-EDO) se convierten en un tono entero exacto (200.0¢). El modo menor tradicional desaparece en favor de una consonancia suspendida.',
    acousticAnalysisEn:
      'In the G♯3–C♯4–E4 triplet (+5 and +3 visual keys): the +5 span (a 12-EDO fourth) becomes a pure neutral third (333.3¢ ≈ 11:9), while the +3 span (a 12-EDO minor third) becomes an exact whole tone (200.0¢), dissolving minor-mode gravity into suspended resonance.',
    listeningExperimentEs:
      'Sube "Tabla de pícea (FDN)" al 70% y baja "Dureza de macillo" al 35% para acentuar el carácter nocturno de cámara alemana.',
    listeningExperimentEn:
      'Raise "Spruce Soundboard (FDN)" to 70% and lower "Hammer Hardness" to 35% to accentuate an intimate German chamber-grand nocturne timbre.',
    badges: {
      system: '18-EDO · Metamorfosis',
      yearRef: 'Op. 27/2 × Carrillo (1949)',
      keyIntervalsEs: '+5 teclas = 333¢ (11:9), +3 teclas = 200¢',
      keyIntervalsEn: '+5 keys = 333¢ (11:9), +3 keys = 200¢',
      carrilloFormula: 'Bajo +12 (800¢) · Tresillo 0–5–8',
    },
    bpm: 76,
    durationSec: 22.4,
    recommendedVariant: 'tercios',
    events: buildMoonlightMetamorfosis(),
  },
  {
    id: 'estudio-neutro',
    shortEs: '6 · 3ª Neutra y 11ª',
    shortEn: '6 · Neutral 3rd & 11th',
    titleEs: '6 · Estudio Acústico: Tercera Neutra (11:9) y Undécima (11:8)',
    titleEn: '6 · Acoustic Étude: Neutral Third (11:9) & Harmonic 11th (11:8)',
    descEs: 'Pieza concebida específicamente para mostrar las consonancias del armónico 11 que el 18-EDO captura de forma natural.',
    descEn: 'Composed specifically to showcase the 11th-harmonic consonances captured naturally by 18-EDO.',
    listenForEs: 'Ni mayor ni menor: escucha la estabilidad cristalina del acorde neutro (0–5–11–18).',
    listenForEn: 'Neither major nor minor: listen to the crystalline stability of the neutral chord (0–5–11–18).',
    historicalContextEs:
      'En la acústica contemporánea y la teoría xenharmónica, el 18-EDO es célebre por resolver una carencia histórica del piano europeo: aproximar los intervalos del 11.º armónico natural (presentes en el maqam árabe, la música persa y el espectralismo francés) sin sacrificar la transposición simétrica.',
    historicalContextEn:
      'In contemporary acoustics and xenharmonic theory, 18-EDO is prized for solving a historic blind spot of the European piano: approximating 11th-harmonic intervals (central to Arabic maqam and spectral music) while preserving equal transposition.',
    acousticAnalysisEs:
      'En 12-EDO, el armónico 11 (551.3¢) cae exactamente en la grieta entre Fa (500¢) y Fa♯ (600¢), con un error enorme de ±49¢. En el piano de tercios de tono, el grado 8 (533.3¢) reduce el error a casi un tercio (−18¢), y el grado 5 (333.3¢) captura la tercera neutra 11:9 (347.4¢) con solo −14¢ de desvío.',
    acousticAnalysisEn:
      'In 12-EDO, the 11th harmonic (551.3¢) falls right in the crack between F (500¢) and F♯ (600¢) with a huge ±49¢ error. On Carrillo’s 18-EDO piano, step 8 (533.3¢) cuts that error to −18¢, and step 5 (333.3¢) captures the 11:9 neutral third (347.4¢) within −14¢.',
    listeningExperimentEs:
      'Cambia entre los anclajes "Do central (Tecla 40)" y "La de concierto (Tecla 49)" para apreciar cómo cambia el brillo de los armónicos superiores del arpa.',
    listeningExperimentEn:
      'Switch between the "Middle C (Key 40)" and "Concert A (Key 49)" tonal anchors to hear how upper-register string tension alters harmonic brilliance.',
    badges: {
      system: '18-EDO · Límite-11',
      yearRef: 'Acústica Espectral 18-EDO',
      keyIntervalsEs: '11:9 (333.3¢, −14¢), 11:8 (533.3¢, −18¢)',
      keyIntervalsEn: '11:9 (333.3¢, −14¢), 11:8 (533.3¢, −18¢)',
      carrilloFormula: '0 – 5 – 8 – 11 – 18',
    },
    bpm: 104,
    durationSec: 11.6,
    recommendedVariant: 'tercios',
    events: buildNeutralStudy(),
  },
  {
    id: 'prisma-6edo',
    shortEs: '7 · Tonos Enteros',
    shortEn: '7 · Whole-Tones',
    titleEs: '7 · Prisma Hexagonal (Piano Sauter de 43 Teclas · 6-EDO)',
    titleEn: '7 · Hexagonal Prism (43-Key Sauter Piano · 6-EDO)',
    descEs: 'Fantasía impresionista para el singular piano compacto de tonos enteros de la colección Carrillo-Sauter de 1958.',
    descEn: 'Impressionist fantasy for the compact 43-key whole-tone piano of the 1958 Carrillo-Sauter collection.',
    listenForEs: 'Observa el teclado reducido a 43 teclas: cada 6 teclas se enciende un punto dorado de octava real.',
    listenForEn: 'Look at the 43-key keyboard: every 6 keys lights up a gold dot marking a full 2:1 octave.',
    historicalContextEs:
      'Dentro de los 15 pianos de Bruselas 1958, Carrillo incluyó un instrumento inverso a los microtonales: un piano vertical de tonos enteros (200¢ por tecla). Al necesitar solo 6 teclas por octava en lugar de 12, un mueble estrecho de apenas 43 teclas logra abarcar las 7 octavas completas de un gran piano de concierto.',
    historicalContextEn:
      'Among the 15 Brussels pianos of 1958, Carrillo included the structural inverse of his microtonal instruments: a whole-tone upright (200¢ per key). Needing only 6 keys per octave instead of 12, a narrow 43-key keyboard spans a full 7-octave concert range.',
    acousticAnalysisEs:
      'Aquí la metamorfosis es expansiva (factor ×2): abrir una mano 12 teclas produce ¡dos octavas completas (2400¢)! Además, recuerda que estas mismas 6 notas existen idénticas dentro del piano de tercios de tono (tocando cada 3 teclas: grados 0, 3, 6, 9, 12, 15, 18).',
    acousticAnalysisEn:
      'Here metamorphosis is expansive (×2 factor): a 12-key hand span yields two full octaves (2400¢)! Notably, this exact 6-tone scale also lives intact inside the 18-EDO third-tone piano (every 3rd key: degrees 0, 3, 6, 9, 12, 15, 18).',
    listeningExperimentEs:
      'Observa el Círculo Armónico: los acordes trazan hexágonos y triángulos equiláteros perfectamente simétricos.',
    listeningExperimentEn:
      'Watch the Pitch-Class Circle: harmonies draw perfectly symmetrical hexagons and equilateral triangles.',
    badges: {
      system: '6-EDO · 200.0¢',
      yearRef: 'Sauter 43 teclas, 1958',
      keyIntervalsEs: '1 tecla = 200¢, 6 teclas = Octava 2:1',
      keyIntervalsEn: '1 key = 200¢, 6 keys = 2:1 Octave',
      carrilloFormula: '0 – 1 – 2 – 3 – 4 – 5 – 6',
    },
    bpm: 116,
    durationSec: 14.8,
    recommendedVariant: 'tonos-enteros',
    events: buildWholeTonePrisma(),
  },
  {
    id: 'horizontes-coral',
    shortEs: '8 · Horizontes',
    shortEn: '8 · Horizontes',
    titleEs: '8 · Horizontes — Coral Microinterválico (24-EDO, 1947)',
    titleEn: '8 · Horizontes — Micro-Intervallic Chorale (24-EDO, 1947)',
    descEs: 'Coral polifónico a cuatro voces inspirado en el poema sinfónico Horizontes, con deslizamientos internos de 50 cents.',
    descEn: 'Four-voice polyphonic chorale inspired by Carrillo’s symphonic poem Horizontes, with 50-cent inner voice-leading.',
    listenForEs: 'Escucha cómo las voces centrales se abren y cierran en cuartos de tono mientras el bajo sostiene la raíz.',
    listenForEn: 'Hear how the inner voices expand and contract by quarter-tones over a sustained bass anchor.',
    historicalContextEs:
      'Estrenado por Leopold Stokowski en Pittsburgh y Washington en 1951–52, Horizontes (1947) demostró ante el público sinfónico internacional la riqueza expresiva y lírica de las texturas armónicas lentas en cuartos y octavos de tono.',
    historicalContextEn:
      'Championed by Leopold Stokowski in Pittsburgh and Washington (1951–52), Carrillo’s Horizontes (1947) demonstrated to international symphonic audiences the lyrical warmth of slow-moving quarter- and eighth-tone harmonic fields.',
    acousticAnalysisEs:
      'En el segundo y tercer acorde, la contralto asciende +50¢ mientras el tenor desciende −50¢ en movimiento contrario simétrico, pasando por la tercera neutra (350¢) y la séptima armónica aproximada (950¢ ≈ 7:4, error de −18.8¢) antes de resolver en octava pura.',
    acousticAnalysisEn:
      'In the second and third chords, alto rises +50¢ while tenor falls −50¢ in symmetrical contrary motion, passing through the neutral third (350¢) and harmonic seventh (950¢ ≈ 7:4, −18.8¢ error) before resolving to a pure octave.',
    listeningExperimentEs:
      'Mira el Inspector de Metamorfosis: cada acorde muestra la extensión exacta entre el bajo y la soprano frente a un teclado estándar.',
    listeningExperimentEn:
      'Watch the Metamorphosis Inspector: each chord displays the exact outer-voice span compared against a standard piano.',
    badges: {
      system: '24-EDO · Polifonía',
      yearRef: 'Homenaje a Horizontes (1947)',
      keyIntervalsEs: '7:4 armónica (950¢), 3ª neutra (350¢)',
      keyIntervalsEn: 'Harmonic 7:4 (950¢), Neutral 3rd (350¢)',
      carrilloFormula: 'Voces ±1 paso (±50¢)',
    },
    bpm: 66,
    durationSec: 14.0,
    recommendedVariant: 'cuartos',
    events: buildHorizontesCoral(),
  },
  {
    id: 'espejos-simpaticos',
    shortEs: '9 · Halo Simpático',
    shortEn: '9 · Sympathetic Halo',
    titleEs: '9 · Espejos Simpáticos: Prueba Acústica de Pedal (18 vs 12-EDO)',
    titleEn: '9 · Sympathetic Mirrors: Sustain Pedal Acoustic Test (18 vs 12-EDO)',
    descEs: 'Demostración de laboratorio de por qué un modelo físico supera al muestreo desafinado al recrear el arpa del Sauter 1958.',
    descEn: 'Laboratory demonstration of why physical modeling outperforms pitch-shifted samples in recreating the 1958 Sauter harp.',
    listenForEs: 'Tras cada golpe agudo corto, escucha la cola resonante que queda vibrando en las cuerdas libres del arpa.',
    listenForEn: 'After each short upper staccato ping, listen closely to the resonant tail left ringing across the harp.',
    historicalContextEs:
      'Desafinar muestras grabadas en un piano normal arrastra consigo las resonancias de pedal de quintas y cuartas del 12-EDO. En el ejemplar físico de San Luis Potosí, las cuerdas libres están afinadas en 18-EDO, por lo que el puente transmite energía simpática siguiendo una ley armónica distinta.',
    historicalContextEn:
      'Detuning standard 12-EDO samples bakes in phantom fifth and fourth pedal resonances. On the physical Sauter grand in San Luis Potosí, all undamped strings are tuned to 18-EDO, reshaping how the bridge redistributes sympathetic energy.',
    acousticAnalysisEs:
      'Al carecer el 18-EDO de quinta justa (su paso 11 queda a +31.4¢ de 3:2, fuera de la ventana de acoplamiento de ±15¢), los acoplamientos simpáticos fuertes caen de 10 (en 12-EDO) a 5, concentrados en las octavas (+18, +36 teclas) y la décima mayor (+24 teclas, parcial 5 con parcial 2 a −7.4¢).',
    acousticAnalysisEn:
      'Because 18-EDO lacks a just fifth (step 11 sits +31.4¢ away from 3:2, outside the ±15¢ coupling window), strong sympathetic couplings drop from 10 (in 12-EDO) to 5, focused cleanly on octaves (+18, +36 keys) and the major tenth (+24 keys, partial 5 to partial 2 at −7.4¢).',
    listeningExperimentEs:
      'Sube "Resonancia simpática" al 100%, escucha la pieza en 18-EDO y luego repítela tras pulsar "⇄ A/B" en 12-EDO: percibirás el contraste entre el halo diáfano de octavas y la densa nube de quintas.',
    listeningExperimentEn:
      'Set "Sympathetic Resonance" to 100%, listen in 18-EDO, then repeat in 12-EDO via "⇄ A/B" to hear the crystalline octave halo vs. the dense fifth-based cloud.',
    badges: {
      system: 'Acústica de Puente / Arpa',
      yearRef: 'Experimento Psicoacústico',
      keyIntervalsEs: 'Octavas (+18/+36) y 10ª Mayor (+24)',
      keyIntervalsEn: 'Octaves (+18/+36) & Major 10th (+24)',
      carrilloFormula: 'Parciales n=2..5 (±15¢)',
    },
    bpm: 80,
    durationSec: 11.8,
    recommendedVariant: 'tercios',
    events: buildSympatheticTest(),
  },
  {
    id: 'guia-sonido13',
    shortEs: '10 · Tour Guiado',
    shortEn: '10 · Guided Tour',
    titleEs: '10 · Escala Maestra del Sonido 13 (Tour Didáctico 18-EDO)',
    titleEn: '10 · Master Scale of Sonido 13 (18-EDO Didactic Tour)',
    descEs: 'Síntesis pedagógica auditiva y visual: recorre la octava de 18 grados, su esqueleto de tonos enteros y sus acordes insignia.',
    descEn: 'Visual and aural pedagogical walkthrough: traverses the 18-degree octave, its whole-tone skeleton, and signature chords.',
    listenForEs: 'Fíjate en la tecla +12 (donde acabaría la octava en un piano común) y cómo la escala sigue subiendo hasta +18.',
    listenForEn: 'Watch key +12 (where a conventional octave ends) and see the scale climb 6 more keys to reach +18.',
    historicalContextEs:
      'Para democratizar la lectura microtonal sin inventar decenas de signos de alteración confusos, Julián Carrillo formuló su sistema gráfico numérico universal: en él cada división igual de la octava se numera correlativamente desde Do = 0, integrando los tercios de tono como múltiplos de 5 dentro del ciclo de 90.',
    historicalContextEn:
      'To make microtonal reading practical without inventing dozens of accidentals, Carrillo created his universal numerical notation: every equal division numbers pitches sequentially from C = 0, embedding third-tones as multiples of 5 inside a 90-division cycle.',
    acousticAnalysisEs:
      'El tour demuestra tres propiedades matemáticas de 18 = 3 × 6: (1) progresión lineal de 66.67¢ por tecla; (2) subconjunto cerrado de 6 tonos enteros cada 3 teclas (0, 3, 6, 9, 12, 15, 18 = 200¢ exactos); y (3) contraste entre la tríada neutra (0–5–11–18) y el acorde espectral de 11.ª (0–6–8–18).',
    acousticAnalysisEn:
      'Demonstrates three mathematical properties of 18 = 3 × 6: (1) linear 66.67¢ progression; (2) an exact embedded 6-EDO whole-tone scale every 3 keys (0, 3, 6, 9, 12, 15, 18); and (3) contrast between the neutral triad (0–5–11–18) and the 11th-harmonic spectral chord (0–6–8–18).',
    listeningExperimentEs:
      'Reduce el Tempo a "0.7×" para seguir cada número en el Visor del Atril y cantar mentalmente la llegada a la octava en el grado 18.',
    listeningExperimentEn:
      'Slow Tempo to "0.7×" to follow every degree on the Fallboard Readout and anticipate the arrival of the true octave at step 18.',
    badges: {
      system: '18-EDO · Notación Carrillo',
      yearRef: 'Sistema Numérico (0–17 / 0–90)',
      keyIntervalsEs: '66.7¢ × 18 = 1200¢ · Tonos enteros × 6',
      keyIntervalsEn: '66.7¢ × 18 = 1200¢ · Whole tones × 6',
      carrilloFormula: '0..18 · {0,3,6,9,12,15,18}',
    },
    bpm: 100,
    durationSec: 12.6,
    recommendedVariant: 'tercios',
    events: buildGuidedTour18(),
  },
];
