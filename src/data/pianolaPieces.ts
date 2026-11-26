import { VariantId } from '../audio/tuning';

export interface PianolaEvent {
  timeSec: number;
  durationSec: number;
  keyIndex: number;
  velocity: number;
  sustain?: boolean;
  labelEs?: string;
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

// 1. Concertino en Tercios de Tono (1958)
function buildConcertino(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  const intro: Array<[number, number, number, number, string?, string?]> = [
    [0.2, 2.6, 21, 0.76, 'Inicio suave: un Do grave que sirve de piso', 'Gentle opening: a warm low C setting the floor'],
    [0.25, 2.5, 39, 0.72],
    [0.9, 0.7, 44, 0.64, 'Nota "neutra": ni alegre ni triste, imposible en un piano común', '"Neutral" note: neither happy nor sad, impossible on a normal piano'],
    [1.6, 0.7, 47, 0.68, 'Otro color nuevo escondido entre las teclas habituales', 'Another hidden color tucked between standard notes'],
    [2.3, 1.4, 57, 0.80, '¡Octava completa! Tuvimos que recorrer 18 teclas para llegar aquí', 'Full octave! We had to travel 18 keys to reach it'],
    [3.8, 0.45, 56, 0.65, 'La melodía baja deslizando pasitos diminutos', 'Melody stepping down in tiny, smooth micro-steps'],
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
      labelEs: i === 0 ? 'Parte rápida: cascada brillante recorriendo casi todo el piano' : undefined,
      labelEn: i === 0 ? 'Fast section: sparkling cascade sweeping across the keyboard' : undefined,
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
        labelEs: idx === 0 ? 'Canto agudo: fíjate qué suave se mueve entre teclas vecinas' : undefined,
        labelEn: idx === 0 ? 'Singing high line: notice how smoothly adjacent keys flow' : undefined,
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
      labelEs: i === 0 ? 'Gran acorde final luminoso con todas las cuerdas resonando' : undefined,
      labelEn: i === 0 ? 'Luminous final chord with the whole harp ringing' : undefined,
    });
  });
  return ev;
}

// 2. Metamorfosis I: Bach
function buildBachMetamorfosis(): PianolaEvent[] {
  const measures: Array<{ notes: [number, number, number, number, number]; labelEs?: string; labelEn?: string }> = [
    {
      notes: [39, 43, 46, 51, 55],
      labelEs: ' Son exactamente las mismas teclas del famoso Preludio de Bach, pero redibujadas',
      labelEn: 'These are the exact same keys as Bach’s famous Prelude, redrawn in new colors',
    },
    { notes: [39, 41, 48, 53, 56] },
    {
      notes: [38, 41, 46, 53, 56],
      labelEs: 'La tensión clásica de Bach aquí suena flotante y misteriosa',
      labelEn: 'Bach’s classic tension sounds floating and dreamlike here',
    },
    { notes: [39, 43, 46, 51, 55] },
    {
      notes: [39, 43, 48, 55, 60],
      labelEs: 'La frase sube y se abre como un vitral de colores nuevos',
      labelEn: 'The phrase climbs and opens up like stained glass',
    },
    { notes: [39, 41, 45, 48, 53] },
    { notes: [38, 41, 46, 53, 58] },
    { notes: [38, 40, 43, 46, 51] },
    { notes: [36, 40, 43, 48, 51] },
    { notes: [33, 38, 41, 45, 50] },
    {
      notes: [34, 38, 41, 46, 50],
      labelEs: '¡Aprieta ahora el botón verde "⇄ Comparar" para oír al Bach de siempre!',
      labelEn: 'Click the green "⇄ Compare" button now to hear familiar Bach!',
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

// 3. Preludio a Colón
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
          ? 'La melodía aguda imita a una cantante deslizándose suavemente entre las notas'
          : pIdx === 2
            ? 'Caída suave paso a paso, casi sin escalones'
            : undefined,
      labelEn:
        pIdx === 0
          ? 'The high melody imitates a singer gliding gently between notes'
          : pIdx === 2
            ? 'Soft downward glide with almost seamless steps'
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

// 4. Balbuceos (96)
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
      labelEs: i === 0 ? '¡Increíble! Recorremos 24 teclas seguidas y el tono apenas sube un poquito' : undefined,
      labelEn: i === 0 ? 'Wild! We cross 24 keys in a row and the pitch barely climbs at all' : undefined,
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
            ? 'Al juntar notas tan cercanas aparece un "latido" hipnótico en el aire'
            : undefined,
        labelEn:
          idx === 0 && j === 0
            ? 'Playing such close neighbors creates a hypnotic "heartbeat" shimmer in the air'
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
      labelEs: i === 0 ? 'De punta a punta del piano: 96 teclas para cruzar de un Do al siguiente Do' : undefined,
      labelEn: i === 0 ? 'End to end across the whole piano: 96 keys just to cross from one C to the next!' : undefined,
    });
  }
  t += 48 * 0.055 + 0.3;
  [0, 32, 56, 95].forEach((k, i) => {
    ev.push({ timeSec: t + i * 0.06, durationSec: 3.0, keyIndex: k, velocity: 0.78, sustain: true });
  });
  return ev;
}

// 5. Claro de Luna
function buildMoonlightMetamorfosis(): PianolaEvent[] {
  const bars: Array<{ bass: [number, number]; trip: [number, number, number]; mel?: number; labelEs?: string; labelEn?: string }> = [
    {
      bass: [16, 28],
      trip: [35, 40, 43],
      labelEs: 'La famosa Sonata Claro de Luna tocada con los mismos dedos, pero mucho más luminosa',
      labelEn: 'Beethoven’s famous Moonlight Sonata played with the exact same fingers, now glowing',
    },
    { bass: [15, 27], trip: [35, 40, 43] },
    {
      bass: [12, 24],
      trip: [36, 40, 45],
      labelEs: 'Lo que antes sonaba melancólico y oscuro aquí parece flotar en cristal',
      labelEn: 'What used to sound dark and somber now floats like crystal',
    },
    { bass: [9, 21], trip: [33, 38, 42] },
    { bass: [11, 23], trip: [35, 39, 44], mel: 51 },
    {
      bass: [16, 28],
      trip: [35, 40, 43],
      mel: 52,
      labelEs: 'Entra la conocida melodía aguda transformada por el piano de Carrillo',
      labelEn: 'The famous singing melody enters, reshaped by Carrillo’s piano',
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

// 6. Estudio Neutro
function buildNeutralStudy(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  const roots = [
    { r: 21, labelEs: 'Escucha este acorde: no suena ni alegre (mayor) ni triste (menor)', labelEn: 'Listen to this chord: neither happy (major) nor sad (minor)' },
    { r: 24, labelEs: 'El mismo color misterioso sube un escalón completo', labelEn: 'The same mysterious color steps up smoothly' },
    { r: 29, labelEs: 'Notas que recuerdan al oud árabe o a campanas antiguas', labelEn: 'Colors reminiscent of an Arabic oud or ancient bells' },
    { r: 21, labelEs: 'Regreso tranquilo a casa', labelEn: 'Peaceful return home' },
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
        timeSec: t + i * 0.1 + i * (step - 0.1),
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

// 7. Prisma Tonos Enteros
function buildWholeTonePrisma(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  let t = 0.2;
  ev.push({
    timeSec: t,
    durationSec: 3.5,
    keyIndex: 6,
    velocity: 0.76,
    sustain: true,
    labelEs: 'Mira el teclado corto de 43 teclas: ¡aquí cada paso avanza el doble de rápido!',
    labelEn: 'Look at the compact 43-key keyboard: every step jumps twice as far!',
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
        labelEs: wIdx === 2 ? 'Con abrir una sola mano aquí alcanzas casi medio piano normal' : undefined,
        labelEn: wIdx === 2 ? 'A single hand span here reaches nearly half of a normal piano!' : undefined,
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

// 8. Horizontes
function buildHorizontesCoral(): PianolaEvent[] {
  const ev: PianolaEvent[] = [];
  const chords: Array<{ notes: number[]; labelEs?: string; labelEn?: string }> = [
    {
      notes: [27, 39, 47, 53],
      labelEs: 'Cuatro notas cantando juntas como un coro en cámara lenta',
      labelEn: 'Four notes singing together like a choir in slow motion',
    },
    { notes: [27, 40, 46, 54] },
    {
      notes: [26, 41, 45, 55],
      labelEs: 'Una voz sube un pelito mientras otra baja, fundiéndose sin escalones bruscos',
      labelEn: 'One voice nudges up while another nudges down, melting without sharp jumps',
    },
    { notes: [25, 41, 47, 57] },
    { notes: [23, 39, 48, 56] },
    {
      notes: [15, 39, 47, 63],
      labelEs: 'Acorde final amplio y sereno',
      labelEn: 'Wide, peaceful closing chord',
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
    labelEs: 'Dejamos pisado el pedal en un Do grave para que las cuerdas queden libres',
    labelEn: 'Holding the pedal on a low C so the harp strings stay free to vibrate',
  });
  t += 1.2;

  const pings: Array<[number, string, string]> = [
    [39, 'Toque seco a +18 teclas: ¡escucha cómo las demás cuerdas se quedan cantando!', 'Short tap +18 keys up: listen to the other strings singing back!'],
    [45, 'Toque seco a +24 teclas: otro eco limpio y cristalino en la madera', 'Short tap +24 keys up: another crystal-clear echo in the wood'],
    [50, 'Toque seco a +29 teclas: aquí casi no hay eco, manteniendo el sonido transparente', 'Short tap +29 keys up: very little echo here, keeping the sound transparent'],
    [57, 'Toque seco a +36 teclas: brillo puro dos octavas arriba', 'Short tap +36 keys up: pure ring two octaves higher'],
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

// 10. Tour Guiado
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
          ? 'Empezamos en Do (0): vamos a subir los 18 escalones uno por uno'
          : s === 12
            ? 'Tecla 12: en un piano normal aquí ya habrías llegado al otro Do, ¡pero aún falta!'
            : s === 18
              ? '¡Tecla 18 (punto dorado): ahora sí llegamos al siguiente Do!'
              : undefined,
      labelEn:
        s === 0
          ? 'Starting on C (0): let’s climb all 18 steps one by one'
          : s === 12
            ? 'Key 12: on a normal piano you’d already be at the next C—still 6 keys to go!'
            : s === 18
              ? 'Key 18 (gold dot): now we’ve reached the next true C!'
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
      labelEs: idx === 0 ? 'Si pisas de 3 en 3 teclas, obtienes una escala de película de ensueño' : undefined,
      labelEn: idx === 0 ? 'Stepping every 3rd key gives you a dreamy storybook scale' : undefined,
    });
    t += 0.34;
  });
  t += 0.55;

  const demoChords: Array<[number[], string, string]> = [
    [[39, 44, 50, 57], 'Acorde "neutro": misterioso, a medio camino entre alegre y melancólico', '"Neutral" chord: mysterious, halfway between bright and bittersweet'],
    [[39, 45, 47, 57], 'Acorde brillante con una de las notas secretas del piano de Carrillo', 'Glowing chord featuring one of Carrillo’s secret in-between notes'],
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
    descEs: 'Inspirada en el concierto que Julián Carrillo grabó en París para presentar su nuevo piano de media cola al mundo.',
    descEn: 'Inspired by the concerto Julián Carrillo recorded in Paris to introduce his new baby grand to the world.',
    listenForEs: 'Empieza lento y misterioso, y luego despega en cascadas rápidas usando las notas nuevas del piano.',
    listenForEn: 'Begins slow and mysterious, then takes off in sparkling runs using the piano’s new in-between notes.',
    historicalContextEs:
      'En 1958, Carrillo llevó sus pianos recién fabricados a la Feria Mundial de Bruselas y luego a París, donde dirigió una orquesta completa junto al pianista Bernard de Flavigny. Aquel disco demostró que este piano no era una simple curiosidad científica, sino un instrumento lleno de emoción.',
    historicalContextEn:
      'In 1958, Carrillo brought his newly built pianos to the Brussels World’s Fair and then to Paris, conducting a full orchestra with pianist Bernard de Flavigny. That recording proved this piano wasn’t just a scientific curiosity, but a deeply expressive instrument.',
    acousticAnalysisEs:
      'Como aquí caben 18 notas antes de repetir el siguiente Do (en lugar de las 12 de siempre), la melodía puede moverse con pasos más pequeñitos y suaves, parecidos a un suspiro o a un violín deslizándose.',
    acousticAnalysisEn:
      'Because 18 notes fit before the next C repeats (instead of the usual 12), melodies can move in smaller, gentler steps—almost like a sigh or a sliding violin.',
    listeningExperimentEs:
      'Mientras suena la parte rápida (a partir del segundo 8), mueve abajo el control "Suavidad del martillo" para sentir cómo cambia entre un piano dulce de sala y uno brillante de concierto.',
    listeningExperimentEn:
      'During the fast cascade (around 8s), slide "Hammer softness" at the bottom to feel it shift from an intimate parlor piano to a bright concert grand.',
    badges: {
      system: '18 notas por octava',
      yearRef: 'París / Bruselas, 1958',
      keyIntervalsEs: '18 teclas = 1 octava',
      keyIntervalsEn: '18 keys = 1 octave',
      carrilloFormula: 'Notas 0 – 5 – 8 – 18',
    },
    bpm: 96,
    durationSec: 20.5,
    recommendedVariant: 'tercios',
    events: buildConcertino(),
  },
  {
    id: 'metamorfosis-bach',
    shortEs: '2 · Bach Transformado',
    shortEn: '2 · Bach Transformed',
    titleEs: '2 · El Preludio de Bach «Metamorfoseado»',
    titleEn: '2 · Bach’s Prelude “Metamorphosed”',
    descEs: '¿Qué pasa si un pianista se sienta en este piano y toca exactamente las teclas del famoso Preludio de Bach?',
    descEn: 'What happens if a pianist sits at this piano and presses the exact keys of Bach’s famous Prelude in C?',
    listenForEs: 'Aprieta el botón verde "⇄ Comparar" mientras suena para pasar del Bach de toda la vida al de Carrillo.',
    listenForEn: 'Click the green "⇄ Compare" button while it plays to flip between classic Bach and Carrillo’s world!',
    historicalContextEs:
      'Por esto Carrillo bautizó a sus instrumentos como "pianos metamorfoseadores". Su idea era genial: no obligar a los músicos a olvidar lo que ya sabían tocar, sino dejar que el propio piano transformara las obras clásicas en música completamente nueva.',
    historicalContextEn:
      'This is why Carrillo called them "metamorphoser pianos." His idea was brilliant: instead of forcing pianists to relearn their craft, let the piano itself transform classic repertoire into brand-new music.',
    acousticAnalysisEs:
      'Cada distancia se encoge a dos terceras partes de su tamaño normal. Es como mirar un cuadro famoso a través de un prisma: el ritmo y el dibujo de las manos son idénticos a Bach, pero los acordes suenan soñadores e inesperados.',
    acousticAnalysisEn:
      'Every musical distance shrinks to two-thirds of its normal size. Like viewing a famous painting through a prism, the rhythm and hand shapes are 100% Bach, yet the harmonies turn dreamy and unexpected.',
    listeningExperimentEs:
      'Alterna varias veces el botón verde "⇄ Comparar" sin detener la música y mira cómo cambian las figuras geométricas en el "Reloj de Notas" debajo del piano.',
    listeningExperimentEn:
      'Click the green "⇄ Compare" button back and forth mid-song and watch how the shapes inside the "Octave Note Clock" below the piano transform.',
    badges: {
      system: 'Mismos dedos, nuevo sonido',
      yearRef: 'Idea de Carrillo (1949)',
      keyIntervalsEs: '12 teclas suenan más cerradas',
      keyIntervalsEn: '12 keys sound closer together',
      carrilloFormula: 'Bach en tercios de tono',
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
    titleEs: '3 · Preludio a Colón — El nacimiento del Sonido 13 (1922)',
    titleEn: '3 · Prelude to Columbus — Birth of Sonido 13 (1922)',
    descEs: 'Homenaje a la legendaria primera obra con la que Carrillo asombró al mundo usando notas más pequeñas que el semitono.',
    descEn: 'Tribute to the legendary debut piece with which Carrillo amazed the world using notes smaller than a semitone.',
    listenForEs: 'Fíjate en la melodía aguda: se desliza tan suavecito que parece una voz humana cantando sin escalones.',
    listenForEn: 'Listen to the high melody: it glides so smoothly it almost sounds like a human voice singing.',
    historicalContextEs:
      'Estrenada en los años veinte en México y Nueva York, Preludio a Colón dejó maravillados a grandes directores como Leopold Stokowski. En ella una soprano cantaba melodías flotantes acompañada de arpa, flauta, cuerdas y guitarra adaptada.',
    historicalContextEn:
      'Premiered in the 1920s in Mexico and New York, Prelude to Columbus captivated conductors like Leopold Stokowski. Its original ensemble paired a wordless soprano voice with harp, flute, strings, and adapted guitar.',
    acousticAnalysisEs:
      'Esta pieza usa el piano de Cuartos de Tono (24 notas por octava). Imagina que entre cada tecla blanca y negra de un piano normal metemos una tecla extra justo a la mitad: conserva todas las notas normales, pero duplica los matices.',
    acousticAnalysisEn:
      'This piece uses the Quarter-Tone piano (24 notes per octave). Imagine slipping one extra key halfway between every single key of a normal piano: you keep all familiar notes while doubling your expressive shades.',
    listeningExperimentEs:
      'Mantén presionada la tecla Shift de tu computadora (o haz clic en "Pedal suave") mientras suena para darle un toque íntimo y misterioso.',
    listeningExperimentEn:
      'Hold Shift on your keyboard (or click "Soft pedal") during playback for a hushed, ethereal atmosphere.',
    badges: {
      system: '24 notas por octava',
      yearRef: 'Obra pionera (1922)',
      keyIntervalsEs: '24 teclas = 1 octava',
      keyIntervalsEn: '24 keys = 1 octave',
      carrilloFormula: 'Medios escalones suaves',
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
    titleEs: '4 · Balbuceos — 96 teclas dentro de una sola octava (1958)',
    titleEn: '4 · Balbuceos — 96 keys inside one single octave (1958)',
    descEs: 'El experimento más extremo de Carrillo: ¡todo el ancho del piano sirve de "lupa" para recorrer de un Do al siguiente Do!',
    descEn: 'Carrillo’s wildest invention: the entire width of the piano acts like a magnifying glass between one C and the next!',
    listenForEs: 'Verás moverse decenas de teclas en el teclado mientras el sonido sube como una sirena finísima.',
    listenForEn: 'Watch dozens of keys light up across the board while the pitch rises like a silky siren.',
    historicalContextEs:
      'Carrillo decía con orgullo que había logrado "desintegrar el tono musical tal como los físicos desintegraron el átomo". Para demostrarlo encargó este asombroso piano de 96 teclas donde caben 16 notas diminutas dentro de un solo tono.',
    historicalContextEn:
      'Carrillo famously said he had "split the musical whole tone just as modern physicists split the atom." To prove it, he built this astonishing 96-key upright packing 16 tiny micro-steps into every single whole tone.',
    acousticAnalysisEs:
      'Cuando se tocan dos o tres teclas muy cercanas aquí (entre los segundos 3 y 8), los sonidos están tan juntitos que tu oído los funde en una sola nota que "late" suavemente como ondas en el agua.',
    acousticAnalysisEn:
      'When two or three nearby keys are played together here (between 3s and 8s), the pitches sit so close that your ear blends them into a single tone gently pulsing like ripples on water.',
    listeningExperimentEs:
      '¡Haz la travesura! Desmarca arriba "Cambiar al piano ideal", pasa el menú 1 a "Tercios de Tono" y vuelve a escucharla: el paseo diminuto se convertirá en una montaña rusa gigante.',
    listeningExperimentEn:
      'Try a fun trick: uncheck "Auto-pick piano" above, switch menu 1 to "Third-Tones," and press Listen again—the tiny 1-octave stroll explodes across the whole range!',
    badges: {
      system: '96 notas en 1 octava',
      yearRef: 'Joya de Bruselas (1958)',
      keyIntervalsEs: '96 teclas = de Do4 a Do5',
      keyIntervalsEn: '96 keys = from C4 to C5',
      carrilloFormula: 'Efecto lupa sonora',
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
    titleEs: '5 · «Claro de Luna» de Beethoven en otra dimensión',
    titleEn: '5 · Beethoven’s “Moonlight” Sonata in Another Dimension',
    descEs: 'La melodía nocturna más famosa de Beethoven tocada tecla por tecla en el piano de tercios de tono.',
    descEn: 'Beethoven’s beloved nocturne played key-for-key on the third-tone metamorphoser piano.',
    listenForEs: 'Nota cómo desaparece la tristeza pesada del original y aparece una calma luminosa y flotante.',
    listenForEn: 'Notice how the heavy sadness of the original melts into a bright, floating calm.',
    historicalContextEs:
      'Carrillo pensaba que después de siglos usando siempre las mismas 12 notas, la música merecía colores frescos. Escuchar a Beethoven aquí nos permite entender al instante qué se siente tocar lo conocido en un instrumento distinto.',
    historicalContextEn:
      'Carrillo believed that after centuries of using the same 12 notes, music deserved fresh colors. Hearing Beethoven here lets anyone instantly grasp what it feels like to play something familiar on a transformed keyboard.',
    acousticAnalysisEs:
      'En un piano común esta obra suena muy melancólica por su acorde menor. Pero en este piano esas mismas tres teclas forman una combinación suave y abierta que quita lo sombrío y deja una atmósfera de ensueño.',
    acousticAnalysisEn:
      'On a normal piano this piece sounds deeply somber because of its minor chord. On this piano those exact same keys form an open, luminous spacing that lifts the shadow away.',
    listeningExperimentEs:
      'Alterna el botón verde "⇄ Comparar" a mitad de la pieza: sentirás literalmente cómo se apaga y se enciende la luz del cuarto musical.',
    listeningExperimentEn:
      'Click the green "⇄ Compare" button halfway through: you’ll literally feel the mood of the room shift from dark velvet to starlight.',
    badges: {
      system: '18 notas por octava',
      yearRef: 'Beethoven × Carrillo',
      keyIntervalsEs: 'De sombrío a luminoso',
      keyIntervalsEn: 'From somber to luminous',
      carrilloFormula: 'Misma partitura, otra luz',
    },
    bpm: 76,
    durationSec: 22.4,
    recommendedVariant: 'tercios',
    events: buildMoonlightMetamorfosis(),
  },
  {
    id: 'estudio-neutro',
    shortEs: '6 · Ni Alegre ni Triste',
    shortEn: '6 · Neither Major nor Minor',
    titleEs: '6 · El acorde secreto: ni alegre ni triste',
    titleEn: '6 · The Secret Chord: Neither Happy nor Sad',
    descEs: 'Descubre la emoción más especial de este piano: acordes que viven justo a la mitad entre lo alegre y lo melancólico.',
    descEn: 'Discover this piano’s signature emotion: chords living right halfway between bright major and wistful minor.',
    listenForEs: 'Cierra un momento los ojos y trata de decidir si suena feliz o nostálgico: ¡es ambos a la vez!',
    listenForEn: 'Close your eyes for a second and try to decide if it sounds happy or wistful—it’s both at once!',
    historicalContextEs:
      'En la música occidental aprendimos que casi todo acorde es "mayor" (alegre) o "menor" (triste). Sin embargo, músicas milenarias de Medio Oriente llevan siglos cantando una nota preciosísima que está justo en medio, y que el piano europeo había dejado fuera.',
    historicalContextEn:
      'Western music taught us that chords are mostly "major" (happy) or "minor" (sad). Yet Middle Eastern traditions have sung a gorgeous in-between note for centuries—one that normal pianos simply couldn’t play.',
    acousticAnalysisEs:
      'Al dividir la octava en 18 partes, la quinta tecla a partir de Do cae justo en ese punto mágico intermedio. Suena estable, dulce y reposado, sin sonar desafinado.',
    acousticAnalysisEn:
      'By splitting the octave into 18 steps, the 5th key up from C lands right on that sweet spot in the middle—sounding warm, settled, and naturally in tune.',
    listeningExperimentEs:
      'Al terminar la pieza, prueba tú mismo tocar juntas las teclas con los números 0, 5, 11 y 0 siguiente (punto dorado) para crear este acorde con tus manos.',
    listeningExperimentEn:
      'When it finishes, try pressing keys numbered 0, 5, 11, and the next gold-dot 0 together to play this chord yourself!',
    badges: {
      system: '18 notas por octava',
      yearRef: 'Emoción intermedia',
      keyIntervalsEs: 'Acorde "neutro" (+5 teclas)',
      keyIntervalsEn: '"Neutral" chord (+5 keys)',
      carrilloFormula: 'Teclas 0 – 5 – 11 – 0',
    },
    bpm: 104,
    durationSec: 11.6,
    recommendedVariant: 'tercios',
    events: buildNeutralStudy(),
  },
  {
    id: 'prisma-6edo',
    shortEs: '7 · Piano Corto (43)',
    shortEn: '7 · Short Piano (43)',
    titleEs: '7 · El pequeño gigante de 43 teclas (Tonos Enteros)',
    titleEn: '7 · The Little 43-Key Giant (Whole-Tones)',
    descEs: 'Un viaje de fantasía en el piano más compacto de Carrillo, donde pocas teclas recorren todo el registro.',
    descEn: 'A fairytale cascade on Carrillo’s most compact piano, where just 43 keys cover a huge concert range.',
    listenForEs: 'Mira cuántos puntos dorados aparecen en el teclado: ¡cada 6 teclas ya diste la vuelta completa a otra octava!',
    listenForEn: 'Look how many gold dots appear on the keyboard: every 6 keys already completes a full octave!',
    historicalContextEs:
      'Además de hacer pianos con notas muy pequeñitas, en 1958 Carrillo hizo uno al revés: quitó los escalones chicos y dejó solo pasos amplios iguales. Así logró meter el alcance entero de un gran piano de cola en un teclado chiquito de 43 teclas.',
    historicalContextEn:
      'Alongside pianos with tiny steps, in 1958 Carrillo built the exact opposite: a piano with wide, even steps—packing the full reach of a concert grand into a cozy 43-key keyboard.',
    acousticAnalysisEs:
      'Produce automáticamente esa sonoridad mágica de "sueño o recuerdo" que escuchamos en las películas animadas o en la música impresionista de Claude Debussy, permitiendo cruzar cinco octavas sin esfuerzo.',
    acousticAnalysisEn:
      'It naturally produces that magical "dream sequence" shimmer familiar from classic film scores and Claude Debussy, letting one hand sweep five octaves effortlessly.',
    listeningExperimentEs:
      'Arrastra el ratón de izquierda a derecha sobre el teclado al terminar la pieza: ¡harás el barrido de ensueño más fácil del mundo!',
    listeningExperimentEn:
      'Drag your mouse across the keys from left to right when it ends for an instant storybook harp glissando!',
    badges: {
      system: '6 notas por octava',
      yearRef: 'Sauter 43 teclas (1958)',
      keyIntervalsEs: '6 teclas = 1 octava entera',
      keyIntervalsEn: '6 keys = 1 full octave',
      carrilloFormula: '1 mano abarca casi 3 octavas',
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
    titleEs: '8 · Horizontes — Acordes que respiran en cámara lenta',
    titleEn: '8 · Horizontes — Chords Breathing in Slow Motion',
    descEs: 'Inspirada en el poema sinfónico Horizontes (1947), donde las armonías se mueven sin saltos bruscos.',
    descEn: 'Inspired by Carrillo’s symphonic poem Horizontes (1947), where harmonies morph without sudden jumps.',
    listenForEs: 'Pon atención al centro del acorde: una nota sube suavemente mientras su vecina baja al mismo tiempo.',
    listenForEn: 'Listen inside the middle of the chord: one note rises gently while its neighbor drifts down.',
    historicalContextEs:
      'Cuando esta música se escuchó con orquesta en Estados Unidos a inicios de los años cincuenta, el público quedó sorprendido de lo cálida, serena y poética que podía sonar la microtonalidad en tiempos lentos.',
    historicalContextEn:
      'When American symphony audiences heard Horizontes in the early 1950s, they were struck by how warm, serene, and poetic microtonal harmony sounded at slow tempos.',
    acousticAnalysisEs:
      'Usando cuartos de tono (medios escalones), los acordes cambian de color poquito a poco, como cuando los tonos del cielo van cambiando lentamente durante un atardecer.',
    acousticAnalysisEn:
      'Using quarter-tones (half-semitones), chords shift color gradually—much like the sky slowly changing hues at sunset.',
    listeningExperimentEs:
      'Sube "Resonancia de madera" abajo al 75% para envolver este coral en una acústica cálida de sala de conciertos.',
    listeningExperimentEn:
      'Turn "Wood resonance" up to 75% at the bottom to wrap this chorale in a warm concert-hall glow.',
    badges: {
      system: '24 notas por octava',
      yearRef: 'Obra sinfónica (1947)',
      keyIntervalsEs: 'Transiciones suaves como atardecer',
      keyIntervalsEn: 'Sunset-smooth chord shifts',
      carrilloFormula: '4 voces en calma',
    },
    bpm: 66,
    durationSec: 14.0,
    recommendedVariant: 'cuartos',
    events: buildHorizontesCoral(),
  },
  {
    id: 'espejos-simpaticos',
    shortEs: '9 · Eco del Arpa',
    shortEn: '9 · Harp Echo',
    titleEs: '9 · El secreto dentro de la tapa: cómo se responden las cuerdas',
    titleEn: '9 · Inside the Lid: How the Strings Answer Each Other',
    descEs: 'Un pequeño experimento para descubrir cómo vibran solas las cuerdas del arpa cuando pisas el pedal.',
    descEn: 'A quick sound experiment showing how free strings across the harp sing back on their own when the pedal is down.',
    listenForEs: 'Después de cada golpecito agudo corto, escucha en el silencio el "halo" suave que se queda flotando.',
    listenForEn: 'Right after each short high tap, listen in the silence to the gentle halo left floating in the air.',
    historicalContextEs:
      'En cualquier piano acústico real, cuando pisas el pedal derecho y tocas una nota fuerte, otras cuerdas que ni siquiera tocaste empiezan a vibrar solitas por empatía física a través de la madera.',
    historicalContextEn:
      'In any real acoustic grand, holding the right pedal and striking a crisp note causes other untouched strings to vibrate along sympathetically through the wooden bridge.',
    acousticAnalysisEs:
      'Como las cuerdas del piano de Carrillo están afinadas de otra manera, ese "eco interno" es mucho más limpio y transparente que la nube espesa que se forma en un piano común.',
    acousticAnalysisEn:
      'Because Carrillo’s strings are tuned to a fresh pattern, that internal harp echo rings much cleaner and clearer than the thick cloud of a regular piano.',
    listeningExperimentEs:
      'Sube abajo "Eco de cuerdas libres" al 100%, escúchala aquí y luego cambia al modo Normal con el botón verde "⇄ Comparar" para notar la diferencia en el eco.',
    listeningExperimentEn:
      'Turn "Free-string echo" up to 100% below, listen once, then click the green "⇄ Compare" button to hear how the echo changes on a normal piano.',
    badges: {
      system: 'Física real de cuerdas',
      yearRef: 'Curiosidad acústica',
      keyIntervalsEs: 'Mira brillar las cuerdas arriba',
      keyIntervalsEn: 'Watch the strings glow above',
      carrilloFormula: 'Pedal + toques cortos',
    },
    bpm: 80,
    durationSec: 11.8,
    recommendedVariant: 'tercios',
    events: buildSympatheticTest(),
  },
  {
    id: 'guia-sonido13',
    shortEs: '10 · Paseo Guiado',
    shortEn: '10 · Guided Walk',
    titleEs: '10 · Paseo guiado en 12 segundos (Ideal para empezar)',
    titleEn: '10 · 12-Second Guided Walk (Great Place to Start!)',
    descEs: 'La manera más rápida y visual de entender cómo están acomodadas las notas en el piano de tercios de tono.',
    descEn: 'The quickest visual and musical walkthrough of how notes are laid out on the third-tone piano.',
    listenForEs: 'Mira los mensajes arriba del teclado: verás pasar la tecla 12 y llegar a la meta en la tecla 18.',
    listenForEn: 'Watch the messages above the keys as the scale passes key 12 and reaches home at key 18!',
    historicalContextEs:
      'Para no llenar las partituras de símbolos complicados, Carrillo propuso numerar las notas empezando siempre en 0 para el Do. Así cualquier persona curiosa puede leer y entender qué está sonando con solo contar.',
    historicalContextEn:
      'Instead of cluttering sheet music with confusing symbols, Carrillo numbered notes starting at 0 for C—making it easy for any curious listener to follow along simply by counting.',
    acousticAnalysisEs:
      'Primero escuchas los 18 pasitos completos de un Do a otro; enseguida oyes cómo al brincar de 3 en 3 teclas obtienes tonos enteros exactos; y al final escuchas dos acordes emblemáticos de este piano.',
    acousticAnalysisEn:
      'First you hear all 18 steps from C to C; next you hear how skipping every 3rd key yields smooth whole steps; and finally you hear two signature chords of this instrument.',
    listeningExperimentEs:
      'Pon la velocidad en "0.7×" (a la derecha de la barra de tiempo) para ir viendo con toda calma cómo van subiendo los números en el tablero del piano.',
    listeningExperimentEn:
      'Slow the speed menu to "0.7×" (right of the timer) so you can comfortably watch the numbers count up on the fallboard.',
    badges: {
      system: 'Explicación paso a paso',
      yearRef: 'Para todo público',
      keyIntervalsEs: 'Del 0 al 18 en orden',
      keyIntervalsEn: 'Counting 0 to 18 in order',
      carrilloFormula: '¡Empieza por aquí!',
    },
    bpm: 100,
    durationSec: 12.6,
    recommendedVariant: 'tercios',
    events: buildGuidedTour18(),
  },
];
