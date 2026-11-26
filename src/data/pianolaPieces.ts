import { VariantId } from '../audio/tuning';

export interface PianolaEvent {
  timeSec: number;
  durationSec: number;
  keyIndex: number; // 0-based on keyboard (index 39 = Key 40 / C4 on 88-key)
  velocity: number; // 0.1..1.0
  sustain?: boolean;
  labelEs?: string; // Optional live didactic annotation shown while this event plays!
  labelEn?: string;
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
  bpm: number;
  durationSec: number;
  recommendedVariant: VariantId;
  events: PianolaEvent[];
}

// 1. Concertino en Tercios de Tono (1958) — Homage to Carrillo & Bernard de Flavigny
function buildConcertino(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  // Section A: Lento misterioso (0 - 8s) — C4 = 39, C3 = 21 (+18 = octave)
  const intro: Array<[number, number, number, number, string?, string?]> = [
    [0.2, 2.6, 21, 0.76, 'Lento: Octava grave Do3 (Carrillo 0)', 'Lento: Bass octave C3 (Carrillo 0)'],
    [0.25, 2.5, 39, 0.72],
    [0.9, 0.7, 44, 0.64, 'Tercera neutra (+5 tercios = 333¢)', 'Neutral third (+5 steps = 333¢)'],
    [1.6, 0.7, 47, 0.68, 'Undécima armónica (+8 tercios = 533¢)', 'Harmonic 11th (+8 steps = 533¢)'],
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

  // Section B: Allegro metamórfico (7.5s - 18s) — Virtuosic 18-EDO arpeggios & third-tone runs
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

  // Lyrical dialog in third-tones over pulsing neutral harmony
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

  // Final radiant 18-EDO cadence (octaves + major tenth + neutral third)
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

// 2. Metamorfosis I: J. S. Bach — Prelude in C Major (BWV 846) literal keyboard fingerings!
function buildBachMetamorfosis(): PianolaEvent[] {
  // Exact 12-EDO MIDI offsets from A0 (21): C4=39, D4=41, E4=43, F4=44, G4=46, A4=48, B4=50, C5=51, D5=53, E5=55, F5=56, G5=58, A5=60
  const measures: Array<{ notes: [number, number, number, number, number]; labelEs?: string; labelEn?: string }> = [
    {
      notes: [39, 43, 46, 51, 55],
      labelEs: 'Compás 1 (Do-Mi-Sol-Do-Mi visual): en 18-EDO la "octava" de 12 teclas mide 800¢',
      labelEn: 'Bar 1 (visual C-E-G-C-E): in 18-EDO the 12-key "octave" spans 800¢',
    }, // C maj
    { notes: [39, 41, 48, 53, 56] }, // Dm7/C
    {
      notes: [38, 41, 46, 53, 56],
      labelEs: 'Compás 3 (Sol7/Si visual): escucha cómo desaparece el tritono tradicional',
      labelEn: 'Bar 3 (visual G7/B): hear how the traditional tritone transforms',
    }, // G7/B
    { notes: [39, 43, 46, 51, 55] }, // C maj
    {
      notes: [39, 43, 48, 55, 60],
      labelEs: 'Compás 5 (La menor/Do visual): se expande hacia el registro luminoso de 18-EDO',
      labelEn: 'Bar 5 (visual Am/C): opens into the luminous upper register of 18-EDO',
    }, // Am/C
    { notes: [39, 41, 45, 48, 53] }, // D7/C
    { notes: [38, 41, 46, 53, 58] }, // G/B
    { notes: [38, 40, 43, 46, 51] }, // Cmaj7/B
    { notes: [36, 40, 43, 48, 51] }, // Am7
    { notes: [33, 38, 41, 45, 50] }, // D7
    {
      notes: [34, 38, 41, 46, 50],
      labelEs: 'Usa el botón "⇄ A/B 18↔12" arriba para comparar con Bach original al instante',
      labelEn: 'Click "⇄ A/B 18↔12" above to compare with original Bach in real time',
    }, // G maj
  ];

  const ev: PianolaEvent[] = [];
  let t = 0.2;
  const s = 0.165;
  for (const m of measures) {
    const [n0, n1, n2, n3, n4] = m.notes;
    // Classic BWV 846 16-note pattern (two 8-note halves per measure, simplified to 1 lush cycle per harmony + repeat)
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
  // Final chord
  [27, 39, 43, 46, 51, 55].forEach((k, i) => {
    ev.push({ timeSec: t + i * 0.05, durationSec: 2.8, keyIndex: k, velocity: 0.74, sustain: true });
  });
  return ev;
}

// 3. Preludio a Colón — Evocación (1922) — Quarter-tones (24-EDO)
function buildPreludioAColon(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  // In 24-EDO (anchored C4=39): 1 step = 50c (quarter-tone), 24 steps = octave (39 -> 63)
  let t = 0.25;
  // Ethereal harp-like quarter-tone ostinato + vocalise sliding line
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
            ? 'Descenso cromático microinterválico (pasos de 1/4 de tono)'
            : undefined,
      labelEn:
        pIdx === 0
          ? '1922 Evocation: crystalline arpeggios & sliding quarter-tone vocalise (50¢)'
          : pIdx === 2
            ? 'Micro-intervallic descending line (1/4-tone steps)'
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

// 4. Balbuceos — Desintegración del Tono (1958) — 96-EDO (96 keys = 1 single octave!)
function buildBalbuceos96(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  // In 96-EDO: key 0 = C4 (261.6Hz), key 95 = C5 minus 12.5¢! Every single key is 12.5 cents (1/16 tone)!
  let t = 0.2;
  // 1) "Atomization" of the whole tone (keys 0..16 = 1 whole tone divided into 16 micro-steps!)
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

  // 2) Shimmering interference clusters (beating waves ~2-6 Hz)
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
            ? 'Clústeres de dieciseisavos de tono: escucha los batimientos acústicos lentos'
            : undefined,
        labelEn:
          idx === 0 && j === 0
            ? 'Sixteenth-tone clusters: hear the slow acoustic beating waves'
            : undefined,
      });
    });
    t += 1.85;
  });

  // 3) Full sweeping glissando across the 96-key single-octave keyboard!
  for (let i = 0; i < 96; i += 2) {
    ev.push({
      timeSec: t + (i / 2) * 0.055,
      durationSec: 0.5,
      keyIndex: i,
      velocity: 0.52 + (i / 96) * 0.34,
      sustain: true,
      labelEs: i === 0 ? ' Barrido continuo del teclado completo (Do4 → Do5 en una sola octava)' : undefined,
      labelEn: i === 0 ? 'Continuous sweep across the entire keyboard (C4 → C5 in a single octave)' : undefined,
    });
  }
  t += 48 * 0.055 + 0.3;
  // Pure octave extremes (Key 0 + Key 56 major 5th-ish + Key 95)
  [0, 32, 56, 95].forEach((k, i) => {
    ev.push({ timeSec: t + i * 0.06, durationSec: 3.0, keyIndex: k, velocity: 0.78, sustain: true });
  });
  return ev;
}

// 5. Metamorfosis II: Claro de Luna (Beethoven, Op. 27 No. 2) literal keyboard fingerings!
function buildMoonlightMetamorfosis(): PianolaEvent[] {
  // Visual C#m: C#2(16)-C#3(28), triplet G#3(35)-C#4(40)-E4(43)
  const bars: Array<{ bass: [number, number]; trip: [number, number, number]; mel?: number; labelEs?: string; labelEn?: string }> = [
    {
      bass: [16, 28],
      trip: [35, 40, 43],
      labelEs: 'Ostinato de Beethoven en 18-EDO: las octavas del bajo (12 teclas) se vuelven sextas menores',
      labelEn: 'Beethoven ostinato in 18-EDO: the 12-key bass octaves become minor sixths (800¢)',
    },
    { bass: [15, 27], trip: [35, 40, 43] }, // C#m/B
    {
      bass: [12, 24],
      trip: [36, 40, 45],
      labelEs: 'La tríada menor visual (3+4 teclas) suena como 200¢ + 266.7¢ (color modal inédito)',
      labelEn: 'The visual minor triad (3+4 keys) sounds as 200¢ + 266.7¢ (unheard modal color)',
    }, // A maj
    { bass: [9, 21], trip: [33, 38, 42] }, // F#m / D
    { bass: [11, 23], trip: [35, 39, 44], mel: 51 }, // G#7 with G#4 melody
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

// 6. Estudio de Terceras Neutras (11:9) y Undécima Armónica (11:8) — 18-EDO
function buildNeutralStudy(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  // 18-EDO intervals from root: +5 = Neutral 3rd (333.3¢ ≈ 11:9), +8 = 11th harmonic (533.3¢ ≈ 11:8), +11 = closest 5th (733.3¢), +18 = Octave
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
    const pat = idx === 2
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

// 7. Prisma Hexagonal — Tonos Enteros (6-EDO, 43 teclas = 7 octavas!)
function buildWholeTonePrisma(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  // In 6-EDO (43 keys): 6 keys = 1 full octave! Key 12 = C4, Key 18 = C5, Key 24 = C6, Key 30 = C7
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

  // Sweeping multi-octave impressionist cascades
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

// 8. Horizontes — Coral Microinterválico (24-EDO Cuartos de Tono)
function buildHorizontesCoral(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  // Slow 4-voice chorale gliding by 50-cent quarter-tones (C4=39, octave=63)
  const chords: Array<{ notes: number[]; labelEs?: string; labelEn?: string }> = [
    {
      notes: [27, 39, 47, 53],
      labelEs: 'Coral a 4 voces: conducción de voces por cuartos de tono (50¢)',
      labelEn: '4-voice chorale: voice-leading by 50-cent quarter-tones',
    },
    { notes: [27, 40, 46, 54] }, // Inner voices slide by +50¢ / -50¢ in contrary motion!
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

// 9. Espejos Simpáticos (Prueba de Pedal 18-EDO vs 12-EDO)
function buildSympatheticTest(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  let t = 0.2;
  // Sustain pedal down: strike deep bass C3 (21) softly, then ping upper intervals staccato to excite harp!
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

// 10. Escala Maestra del Sonido 13 (Tour Guiado 18-EDO)
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

  // Intact whole-tone skeleton
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

  // Signature chords comparison
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
    descEs: 'Estudio concertante (Lento – Allegro) inspirado en la grabación histórica de Philips con Bernard de Flavigny bajo la batuta de Julián Carrillo.',
    descEn: 'Concertante étude (Lento – Allegro) inspired by the historic 1958 Philips recording with Bernard de Flavigny conducted by Julián Carrillo.',
    listenForEs: 'Observa cómo una octava abarca 18 teclas y escucha el canto melódico en pasos de 66.7 cents.',
    listenForEn: 'Watch how a true octave spans 18 keys and hear the cantabile melody moving in 66.7-cent steps.',
    bpm: 96,
    durationSec: 20.5,
    recommendedVariant: 'tercios',
    events: buildConcertino(),
  },
  {
    id: 'metamorfosis-bach',
    shortEs: '2 · Bach Metamorf.',
    shortEn: '2 · Bach Metamorph.',
    titleEs: '2 · Metamorfosis I: Preludio en Do (J. S. Bach)',
    titleEn: '2 · Metamorphosis I: Prelude in C (J. S. Bach)',
    descEs: 'Las teclas físicas exactas del Preludio BWV 846 de Bach ejecutadas sobre el teclado metamorfoseador de 18-EDO, tal como proponía Carrillo en 1949.',
    descEn: 'The exact physical keys of Bach’s Prelude BWV 846 played on the 18-EDO metamorphoser keyboard, following Carrillo’s 1949 Laws of Metamorphosis.',
    listenForEs: 'Pulsa el botón "⇄ A/B 18↔12" mientras suena para oír cómo la octava de Bach se comprime a 800¢.',
    listenForEn: 'Click "⇄ A/B 18↔12" mid-playback to hear Bach’s octave compress to 800¢ in real time.',
    bpm: 112,
    durationSec: 31.8,
    recommendedVariant: 'tercios',
    events: buildBachMetamorfosis(),
  },
  {
    id: 'preludio-colon',
    shortEs: '3 · Preludio a Colón',
    shortEn: '3 · Prelude to Columbus',
    titleEs: '3 · Preludio a Colón — Evocación (1922)',
    titleEn: '3 · Prelude to Columbus — Evocation (1922)',
    descEs: 'Homenaje a la primera obra emblemática del Sonido 13: arpegios cristalinos y línea vocal deslizante en cuartos de tono (24-EDO, 50¢ por tecla).',
    descEn: 'Homage to the landmark debut work of Sonido 13: crystalline arpeggios and sliding vocalise in quarter-tones (24-EDO, 50¢ per key).',
    listenForEs: 'En 24-EDO la octava exige 24 teclas y los grados conjuntos suenan como un glissando vocal.',
    listenForEn: 'In 24-EDO a true octave spans 24 keys and stepwise motion glides like a human voice.',
    bpm: 84,
    durationSec: 18.2,
    recommendedVariant: 'cuartos',
    events: buildPreludioAColon(),
  },
  {
    id: 'balbuceos-96',
    shortEs: '4 · Balbuceos (96)',
    shortEn: '4 · Balbuceos (96)',
    titleEs: '4 · Balbuceos — Desintegración del Tono (96-EDO)',
    titleEn: '4 · Balbuceos — Atomization of Tone (96-EDO)',
    descEs: 'Inspirada en la audaz obra de 1958 para el piano Sauter de dieciseisavos de tono: las 96 teclas enteras cubren una sola octava (Do4–Do5, 12.5¢ por paso).',
    descEn: 'Inspired by Carrillo’s 1958 work for the sixteenth-tone Sauter piano: all 96 keys span a single octave (C4–C5, 12.5¢ per step).',
    listenForEs: 'Escucha los batimientos lentos de interferencia y el barrido continuo ("desintegración del átomo sonoro").',
    listenForEn: 'Hear slow acoustic wave-beating clusters and a continuous single-octave micro-glissando.',
    bpm: 108,
    durationSec: 14.5,
    recommendedVariant: 'dieciseisavos',
    events: buildBalbuceos96(),
  },
  {
    id: 'metamorfosis-beethoven',
    shortEs: '5 · Claro de Luna',
    shortEn: '5 · Moonlight',
    titleEs: '5 · Metamorfosis II: Claro de Luna (Beethoven)',
    titleEn: '5 · Metamorphosis II: Moonlight Sonata (Beethoven)',
    descEs: 'El célebre tresillo de la Sonata Op. 27 n.º 2 tocado con su digitación tradicional: en 18-EDO la tríada menor se vuelve un acorde luminoso de tonos y tercios.',
    descEn: 'Beethoven’s Op. 27 No. 2 triplet ostinato played with traditional fingering: in 18-EDO the minor triad transforms into a luminous microtonal nocturne.',
    listenForEs: 'La tercera menor visual (3 teclas) mide aquí exactamente 200¢ (un tono entero).',
    listenForEn: 'The visual minor third (3 keys) measures an exact 200¢ whole tone here.',
    bpm: 76,
    durationSec: 22.4,
    recommendedVariant: 'tercios',
    events: buildMoonlightMetamorfosis(),
  },
  {
    id: 'estudio-neutro',
    shortEs: '6 · 3ª Neutra y 11ª',
    shortEn: '6 · Neutral 3rd & 11th',
    titleEs: '6 · Estudio de Tercera Neutra (11:9) y 11ª (11:8)',
    titleEn: '6 · Neutral Third (11:9) & Harmonic 11th (11:8) Étude',
    descEs: 'Explora las dos consonancias armónicas puras que el 18-EDO captura con precisión y que no existen en el piano tradicional de 12 notas.',
    descEn: 'Explores the two pure harmonic consonances captured accurately by 18-EDO that are absent on a standard 12-tone piano.',
    listenForEs: '5 pasos = 333.3¢ (tercera neutra 11:9); 8 pasos = 533.3¢ (undécima natural 11:8).',
    listenForEn: '5 steps = 333.3¢ (11:9 neutral third); 8 steps = 533.3¢ (11:8 natural eleventh).',
    bpm: 104,
    durationSec: 11.6,
    recommendedVariant: 'tercios',
    events: buildNeutralStudy(),
  },
  {
    id: 'prisma-6edo',
    shortEs: '7 · Tonos Enteros',
    shortEn: '7 · Whole-Tones',
    titleEs: '7 · Prisma Hexagonal (Piano de 43 teclas · 6-EDO)',
    titleEn: '7 · Hexagonal Prism (43-Key Whole-Tone Piano · 6-EDO)',
    descEs: 'Escrita para el compacto metamorfoseador Sauter de 43 teclas: al dividir la octava en 6 tonos enteros, el teclado abarca 7 octavas completas.',
    descEn: 'Written for the compact 43-key Sauter metamorphoser: dividing the octave into 6 whole tones lets 43 keys span 7 full octaves.',
    listenForEs: 'Cada 6 teclas duplican la frecuencia; las cascadas impresionistas recorren 5 octavas sin esfuerzo.',
    listenForEn: 'Every 6 keys double the frequency; impressionist cascades sweep 5 octaves effortlessly.',
    bpm: 116,
    durationSec: 14.8,
    recommendedVariant: 'tonos-enteros',
    events: buildWholeTonePrisma(),
  },
  {
    id: 'horizontes-coral',
    shortEs: '8 · Horizontes',
    shortEn: '8 · Horizontes',
    titleEs: '8 · Horizontes — Coral Microinterválico (24-EDO)',
    titleEn: '8 · Horizontes — Micro-Intervallic Chorale (24-EDO)',
    descEs: 'Coral contemplativo a 4 voces inspirado en el poema sinfónico Horizontes (1947), con voces internas que se deslizan en movimiento contrario de 50¢.',
    descEn: 'Contemplative 4-voice chorale inspired by Carrillo’s symphonic poem Horizontes (1947), featuring inner voices gliding in 50¢ contrary motion.',
    listenForEs: 'Nota cómo los acordes respiran y mutan sin saltos bruscos de semitono.',
    listenForEn: 'Notice how harmonies breathe and morph without abrupt semitone jumps.',
    bpm: 66,
    durationSec: 14.0,
    recommendedVariant: 'cuartos',
    events: buildHorizontesCoral(),
  },
  {
    id: 'espejos-simpaticos',
    shortEs: '9 · Halo Simpático',
    shortEn: '9 · Sympathetic Halo',
    titleEs: '9 · Espejos Simpáticos (Prueba de Pedal 18 vs 12)',
    titleEn: '9 · Sympathetic Mirrors (18 vs 12 Pedal Test)',
    descEs: 'Experimento acústico: sostiene Do3 con el pedal y dispara notas staccato agudas para escuchar qué cuerdas libres entran en resonancia simpática.',
    descEn: 'Acoustic experiment: holds C3 with the sustain pedal and pings staccato upper notes to hear which free strings resonate sympathetically.',
    listenForEs: 'En 18-EDO el arpa resuena limpia en octavas (+18/+36) y 10ª mayor (+24), sin quintas fantasma.',
    listenForEn: 'In 18-EDO the harp rings cleanly on octaves (+18/+36) & major 10ths (+24), with no phantom fifths.',
    bpm: 80,
    durationSec: 11.8,
    recommendedVariant: 'tercios',
    events: buildSympatheticTest(),
  },
  {
    id: 'guia-sonido13',
    shortEs: '10 · Tour Guiado',
    shortEn: '10 · Guided Tour',
    titleEs: '10 · Escala Maestra del Sonido 13 (Tour Guiado)',
    titleEn: '10 · Master Scale of Sonido 13 (Guided Tour)',
    descEs: 'Recorrido paso a paso por los 18 tercios de tono, la escala de tonos enteros contenida en su interior y sus acordes característicos.',
    descEn: 'Step-by-step guided tour through all 18 third-tones, the embedded whole-tone scale, and signature microtonal chords.',
    listenForEs: 'Mira los avisos en vivo sobre el teclado en la tecla +12 (800¢) y la tecla +18 (octava real).',
    listenForEn: 'Watch the live callouts at key +12 (800¢) and key +18 (true octave).',
    bpm: 100,
    durationSec: 12.6,
    recommendedVariant: 'tercios',
    events: buildGuidedTour18(),
  },
];
