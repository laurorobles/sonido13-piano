export type Lang = 'es' | 'en';

export const UI_TEXT = {
  es: {
    brandTitle: 'SONIDO 13 · PIANO METAMORFOSEADOR',
    brandSub: 'Julián Carrillo · Carl Sauter (1958)',
    creditBy: 'Recreación virtual por',
    researchBtn: 'Investigación',
    guideBtn: 'Cómo entenderlo',
    labBtn: 'Laboratorio 18-EDO',
    midiBtn: 'MIDI',
    midiConnected: 'MIDI activo',
    variantLabel: '1. Elige el Piano (Colección Sauter 1958)',
    anchorLabel: '2. Anclaje Tonal (Frecuencia base)',
    pianolaTitle: '3. Pianola Animada y Repertorio',
    repertoireStripLabel: 'Obras y Estudios',
    autoSwitchVariant: 'Auto-ajustar piano de la obra',
    abToggleBtn: '⇄ Comparar A/B: 18-EDO ↔ 12-EDO',
    abActive12: '⇄ Escuchando 12-EDO (Volver a 18-EDO)',
    play: 'Reproducir',
    pause: 'Pausar',
    stop: 'Detener',
    speed: 'Tempo',
    exportScl: '.scl/.kbm',
    showCarrilloNums: 'Números Carrillo',
    showQwertyHints: 'Guía Teclado PC',
    acousticTitle: 'Calibración Física del Arpa y Macillos (Modelado Modal + Stulov + FDN)',
    hammer: 'Dureza de macillo',
    hammerTip: 'Fieltro más blando suaviza batimientos agudos; más duro excita parciales altos',
    unison: 'Anchura de unísono',
    unisonTip: 'Desafinación entre las 3 cuerdas de cada nota (estrecha en 18-EDO para nitidez)',
    sympathetic: 'Resonancia simpática',
    sympatheticTip: 'Energía acoplada en cuerdas libres al pisar el pedal (octavas +18 y 10ª +24)',
    inharmonicity: 'Rigidez de cuerda (B)',
    inharmonicityTip: 'Estiramiento natural de parciales por el grosor del acero en 4.83 octavas',
    railsback: 'Curva Railsback',
    railsbackTip: 'Compensación psicoacústica de octavas en extremos grave y agudo',
    soundboard: 'Tabla de pícea (FDN)',
    soundboardTip: 'Resonancia cálida de madera de pícea alpina de media cola Sauter',
    volume: 'Volumen general',
    notationTitle: 'Visor en Vivo · Sonido 13',
    notationEmpty: 'Toca cualquier tecla, usa tu teclado (A–Ñ, Z/X octava) o inicia la Pianola ▶',
    stepLabel: 'Grado Carrillo',
    scale90Label: 'Sistema de 90',
    freqLabel: 'Frecuencia',
    nearest12Label: 'Nota 12-EDO + desvío',
    inharmLabel: 'Rigidez B',
    keyVisualLabel: 'Tecla física',
    pedalUnaCorda: 'Una Corda (Shift)',
    pedalSostenuto: 'Sostenuto',
    pedalSustain: 'Resonancia / Sustain (Espacio)',
    eduMetamorphTitle: '¿Qué es la Metamorfosis?',
    eduCircleTitle: 'Círculo Armónico de la Octava',
    eduIntervalIdle: 'Toca 2 notas seguidas o un acorde para ver cómo se transforma el intervalo',
    eduVisualSpan: 'Distancia en teclas',
    eduNormalPiano: 'En un piano normal (12-EDO)',
    eduSoundingHere: 'Suena aquí',
    eduOctaveLegend: '● Punto dorado = Do real (Octava 2:1 · Grado 0)',
    listenForPrefix: 'Qué escuchar:',
    footerShortcuts:
      'Teclado PC: <kbd>A</kbd>–<kbd>Ñ</kbd> (blancas y negras) · <kbd>Z</kbd>/<kbd>X</kbd> desplazar registro · <kbd>Espacio</kbd> pedal de resonancia · Ratón: arrastra sobre las teclas para glissando.',
    footerDisclaimer:
      'Reconstrucción históricamente informada en DSP (Web Audio / AudioWorklet) basada en la colección Carl Sauter (1958) de Julián Carrillo resguardada en San Luis Potosí.',
    labTitle: 'Laboratorio Acústico · Por qué 18-EDO no es solo desafinar',
    guideTitle: 'Guía Rápida · Cómo entender y tocar el Piano Metamorfoseador',
    close: 'Cerrar',
    compare18: 'Activar 18-EDO (Tercios)',
    compare12: 'Activar 12-EDO (Estándar)',
  },
  en: {
    brandTitle: 'SONIDO 13 · METAMORPHOSER PIANO',
    brandSub: 'Julián Carrillo · Carl Sauter (1958)',
    creditBy: 'Virtual recreation by',
    researchBtn: 'Research',
    guideBtn: 'How It Works',
    labBtn: '18-EDO Lab',
    midiBtn: 'MIDI',
    midiConnected: 'MIDI Ready',
    variantLabel: '1. Choose Piano (Sauter 1958 Collection)',
    anchorLabel: '2. Tonal Anchor (Reference Pitch)',
    pianolaTitle: '3. Animated Pianola & Repertoire',
    repertoireStripLabel: 'Works & Études',
    autoSwitchVariant: 'Auto-select piece’s piano',
    abToggleBtn: '⇄ Compare A/B: 18-EDO ↔ 12-EDO',
    abActive12: '⇄ Hearing 12-EDO (Back to 18-EDO)',
    play: 'Play',
    pause: 'Pause',
    stop: 'Stop',
    speed: 'Tempo',
    exportScl: '.scl/.kbm',
    showCarrilloNums: 'Carrillo Numbers',
    showQwertyHints: 'PC Key Hints',
    acousticTitle: 'Physical Harp & Hammer Calibration (Modal + Stulov + FDN)',
    hammer: 'Hammer Hardness',
    hammerTip: 'Softer felt tames upper beating; harder felt excites higher partials',
    unison: 'Unison Width',
    unisonTip: 'Detuning across the 3 strings per key (kept tight in 18-EDO for clarity)',
    sympathetic: 'Sympathetic Resonance',
    sympatheticTip: 'Coupled energy in undamped strings when sustain is held (octaves +18, 10th +24)',
    inharmonicity: 'String Stiffness (B)',
    inharmonicityTip: 'Natural partial stretching from steel wire stiffness across 4.83 octaves',
    railsback: 'Railsback Curve',
    railsbackTip: 'Psychoacoustic octave stretching at bass and treble extremes',
    soundboard: 'Spruce Soundboard (FDN)',
    soundboardTip: 'Warm Alpine spruce soundboard radiation of a compact Sauter baby grand',
    volume: 'Master Gain',
    notationTitle: 'Live Readout · Sonido 13',
    notationEmpty: 'Click any key, use your PC keyboard (A–;, Z/X shift), or press Play ▶',
    stepLabel: 'Carrillo Degree',
    scale90Label: '90-Division Scale',
    freqLabel: 'Frequency',
    nearest12Label: '12-EDO Ref + Cents',
    inharmLabel: 'Stiffness B',
    keyVisualLabel: 'Physical Key',
    pedalUnaCorda: 'Una Corda (Shift)',
    pedalSostenuto: 'Sostenuto',
    pedalSustain: 'Sustain / Resonance (Space)',
    eduMetamorphTitle: 'What Is Musical Metamorphosis?',
    eduCircleTitle: 'Octave Pitch-Class Circle',
    eduIntervalIdle: 'Play 2 consecutive notes or a chord to see how the interval transforms',
    eduVisualSpan: 'Key span',
    eduNormalPiano: 'On a standard piano (12-EDO)',
    eduSoundingHere: 'Sounds here as',
    eduOctaveLegend: '● Gold dot = True C (2:1 Octave · Degree 0)',
    listenForPrefix: 'What to listen for:',
    footerShortcuts:
      'PC Keyboard: <kbd>A</kbd>–<kbd>;</kbd> · <kbd>Z</kbd>/<kbd>X</kbd> shift register · <kbd>Space</kbd> sustain pedal · Mouse: drag across keys for glissando.',
    footerDisclaimer:
      'Historically informed DSP reconstruction (Web Audio / AudioWorklet) based on Julián Carrillo’s 1958 Carl Sauter collection preserved in San Luis Potosí, Mexico.',
    labTitle: 'Acoustic Lab · Why 18-EDO Is More Than Detuning',
    guideTitle: 'Interactive Guide · Understanding the Metamorphoser Piano',
    close: 'Close',
    compare18: 'Switch to 18-EDO (Third-Tones)',
    compare12: 'Switch to 12-EDO (Standard)',
  },
} as const;

export const GUIDE_HTML = {
  es: `
    <p class="lead">
      El <strong>Piano Metamorfoseador</strong> de Julián Carrillo parece por fuera un piano tradicional de 88 teclas blancas y negras, pero por dentro <strong>redefine la geometría del espacio musical</strong>. Aquí tienes las 4 claves para comprenderlo en un minuto:
    </p>
    <div class="lab-grid">
      <div class="lab-card">
        <h4>1. ¿Por qué conserva el teclado normal?</h4>
        <p>Carrillo diseñó sus pianos para que un pianista clásico no tuviera que reaprender técnica desde cero: tocas con tus dedos de siempre y el instrumento <strong>metamorfosea</strong> automáticamente las distancias interválicas.</p>
      </div>
      <div class="lab-card">
        <h4>2. La regla de oro: 18 teclas = 1 octava</h4>
        <p>En tercios de tono (<strong>18-EDO</strong>), cada tecla avanza <strong>66.67 cents</strong> (en vez de 100¢). Si abres la mano 12 teclas (una octava visual), solo recorres <strong>800 cents</strong> (una sexta menor). ¡Necesitas <strong>18 teclas</strong> (marcadas con punto dorado <code>0</code>) para duplicar la frecuencia!</p>
      </div>
      <div class="lab-card">
        <h4>3. ¿Cómo funciona la notación numérica?</h4>
        <p>Carrillo eliminó pentagramas y sostenidos: <strong>Do es siempre <code>0</code></strong>. En tercios de tono las notas de una octava se numeran del <code>0</code> al <code>17</code> (o de 5 en 5: <code>0, 5, 10... 85</code> dentro de su escala unificada de 90 sonidos por octava).</p>
      </div>
      <div class="lab-card">
        <h4>4. Prueba la comparación A/B en vivo</h4>
        <p>Elige la pieza <strong>2 · Bach Metamorf.</strong> o <strong>5 · Claro de Luna</strong> en la barra superior, dale a <strong>▶ Reproducir</strong> y pulsa el botón <strong>⇄ Comparar A/B: 18-EDO ↔ 12-EDO</strong> mientras suena para escuchar la transformación al instante.</p>
      </div>
    </div>
  `,
  en: `
    <p class="lead">
      Julián Carrillo’s <strong>Metamorphoser Piano</strong> looks on the outside like a classic 88-key grand piano, yet inside it <strong>redefines musical geometry</strong>. Here are the 4 keys to understanding it in one minute:
    </p>
    <div class="lab-grid">
      <div class="lab-card">
        <h4>1. Why keep a standard keyboard?</h4>
        <p>Carrillo kept traditional white and black keys so pianists could use familiar fingerings while the instrument systematically <strong>metamorphoses</strong> every interval.</p>
      </div>
      <div class="lab-card">
        <h4>2. Golden rule: 18 keys = 1 octave</h4>
        <p>In third-tones (<strong>18-EDO</strong>), each key advances <strong>66.67 cents</strong> (instead of 100¢). Spanning 12 keys (a visual octave) yields <strong>800 cents</strong> (a minor sixth). You need <strong>18 keys</strong> (marked with a gold dot <code>0</code>) to reach a true 2:1 octave!</p>
      </div>
      <div class="lab-card">
        <h4>3. Numerical notation (Sonido 13)</h4>
        <p>Carrillo replaced staffs and accidentals with numbers: <strong>C is always <code>0</code></strong>. In 18-EDO, pitches run <code>0</code> to <code>17</code> per octave (or by fives: <code>0, 5, 10... 85</code> in his unified 90-division system).</p>
      </div>
      <div class="lab-card">
        <h4>4. Try live A/B metamorphosis</h4>
        <p>Select piece <strong>2 · Bach Metamorph.</strong> or <strong>5 · Moonlight</strong> in the repertoire bar, press <strong>▶ Play</strong>, and click <strong>⇄ Compare A/B: 18-EDO ↔ 12-EDO</strong> mid-playback to hear the transformation live.</p>
      </div>
    </div>
  `,
};

export const RESEARCH_HTML = {
  es: `
    <h2>Recreación virtual del piano de tercios de tono de Julián Carrillo</h2>
    <p class="lead">
      Esta aplicación es una reconstrucción por <strong>modelado físico híbrido</strong> (banco modal de cuerdas, excitador no lineal de macillo, resonancia simpática acoplada y tabla armónica FDN) del <strong>piano metamorfoseador de tercios de tono (18-EDO)</strong> concebido por <strong>Julián Carrillo (1875–1965)</strong> y construido por la casa alemana <strong>Carl Sauter</strong> en 1958.
    </p>
    <div class="callout">
      <strong>Transparencia organológica:</strong> Las fuentes académicas confirman que el modelo de 1958 de Carl Sauter era un piano de media cola (<em>baby grand</em>) de 88 teclas afinado en 18-EDO, conservado en el <strong>Centro Julián Carrillo de San Luis Potosí</strong>. Sin embargo, los planos originales del encordado y las frecuencias límite exactas de esa unidad permanecen inéditos. Por ello, este instrumento ofrece <strong>5 anclajes tonales seleccionables</strong> que recalibran automáticamente las frecuencias y la curva de inarmonicidad <em>B</em>.
    </div>
    <h3>1. Historia y lógica metamorfoseadora</h3>
    <p>
      Tras patentar sus pianos microtonales en 1940 y construir prototipos en México (c. 1947–1953, incluyendo la versión vertical de Federico Buschmann), Carrillo encargó a <strong>Carl Sauter</strong> (Spaichingen, Alemania) una serie de <strong>15 pianos metamorfoseadores</strong> presentados en la Expo 58 de Bruselas y en la Ciudad de México en 1959.
    </p>
    <p>
      Carrillo conservó intencionadamente el <strong>teclado tradicional de teclas blancas y negras</strong>: así, un pianista clásico ejecuta digitaciones habituales y el instrumento transforma sistemáticamente todos los intervalos (<em>Leyes de metamorfosis musicales</em>, 1949). En el piano de tercios de tono, recorrer físicamente una octava tradicional (12 teclas) produce dos tercios de octava sonora (800 cents, equivalente a una sexta menor), mientras que una octava real (2:1) exige recorrer <strong>18 teclas</strong>.
    </p>
    <h3>2. Acústica del 18-EDO en 4.83 octavas</h3>
    <ul>
      <li><strong>Inarmonicidad homogénea:</strong> Al comprimir 88 cuerdas en 4.83 octavas (p. ej. 58.27 Hz a 1661.22 Hz con Do4 en tecla 40), el coeficiente de rigidez <em>B</em> se mantiene en la franja más favorable (~0.00018 a ~0.00373), produciendo un timbre más homogéneo que un media cola de 12-EDO.</li>
      <li><strong>Resonancia simpática diáfana:</strong> El 18-EDO conserva intacta la escala de tonos enteros (200 y 400 cents), pero carece de quinta justa (3:2) y cuarta justa (4:3). Al pisar el pedal de resonancia, desaparece la nube de quintas del piano estándar y el halo simpático se concentra en octavas (+18, +36 teclas) y décima mayor (+24 teclas).</li>
      <li><strong>Aspereza sensorial y unísono:</strong> Entre Do6 y Sol6, dos teclas contiguas (66.67 cents) baten cerca del pico de máxima aspereza psicoacústica (~0.25 CBW). Por eso el control fino de <em>Unison Width</em> y <em>Dureza de macillo</em> es crucial para la nitidez microtonal.</li>
    </ul>
    <h3>3. Referencia fonográfica</h3>
    <p>
      La referencia sonora histórica principal es el <em>Concertino en tercios de tono</em> para piano «Metamorfoseador Carrillo» y orquesta, grabado para <strong>Philips</strong> por el pianista <strong>Bernard de Flavigny</strong> y la Orchestre de l'Association des Concerts Lamoureux bajo la dirección del propio Julián Carrillo.
    </p>
    <div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(212,175,106,0.25);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
      <span style="font-size:0.82rem;color:#aba08f;">Recreación virtual desarrollada por <a href="https://www.instagram.com/laurorobles/" target="_blank" rel="noopener noreferrer" style="color:#f2d28b;">@laurorobles</a> · <a href="https://extasisrecords.bandcamp.com" target="_blank" rel="noopener noreferrer" style="color:#f2d28b;">@extasisrecords</a></span>
      <a href="./investigacion.html" target="_blank" rel="noopener noreferrer" class="btn primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
        📄 Abrir Anexo de Investigación Completo ↗
      </a>
    </div>
  `,
  en: `
    <h2>Virtual Reconstruction of Julián Carrillo’s Third-Tone Piano</h2>
    <p class="lead">
      This application is a <strong>hybrid physical modeling</strong> reconstruction (modal string bank, nonlinear hammer exciter, coupled sympathetic resonance, and FDN spruce soundboard) of the <strong>third-tone metamorphoser piano (18-EDO)</strong> conceived by <strong>Julián Carrillo (1875–1965)</strong> and built by <strong>Carl Sauter</strong> in 1958.
    </p>
    <div class="callout">
      <strong>Organological transparency:</strong> Academic sources confirm that the 1958 Carl Sauter unit was an 88-key <em>baby grand</em> tuned in 18-EDO, preserved today at the <strong>Centro Julián Carrillo in San Luis Potosí</strong>. Because the original stringing plans and exact boundary pitches remain unpublished, this instrument provides <strong>5 selectable tonal anchors</strong> that dynamically recalibrate frequencies and the inharmonicity curve <em>B</em>.
    </div>
    <h3>1. History & Metamorphoser Logic</h3>
    <p>
      After patenting his microtonal pianos in 1940 and building Mexican prototypes (c. 1947–1953), Carrillo commissioned <strong>Carl Sauter</strong> (Spaichingen, Germany) to build <strong>15 metamorphoser pianos</strong> premiered at Expo 58 in Brussels and exhibited in Mexico City in 1959.
    </p>
    <p>
      Carrillo intentionally preserved the <strong>traditional 88-key white-and-black layout</strong> so a classically trained pianist can play familiar fingerings while the instrument systematically transforms every interval (<em>Laws of Musical Metamorphosis</em>, 1949). Spanning 12 keys yields 800 cents (a minor sixth), while a true octave (2:1) spans <strong>18 keys</strong>.
    </p>
    <h3>2. Acoustics of 18-EDO Across 4.83 Octaves</h3>
    <ul>
      <li><strong>Homogeneous inharmonicity:</strong> Compressing 88 strings into 4.83 octaves keeps string stiffness <em>B</em> in the acoustic sweet spot (~0.00018 to ~0.00373), yielding a warmer, less bell-like treble than a standard 12-EDO baby grand.</li>
      <li><strong>Transparent sympathetic halo:</strong> 18-EDO preserves the whole-tone scale (200 & 400 cents) but omits the perfect fifth (3:2) and fourth (4:3). Depressing the sustain pedal produces a clean halo centered on octaves (+18, +36 keys) and major tenths (+24 keys).</li>
      <li><strong>Sensory roughness & unison control:</strong> In the upper register, adjacent 66.67-cent keys beat near peak psychoacoustic roughness (~0.25 CBW), making tight <em>Unison Width</em> and <em>Hammer Hardness</em> essential for microtonal clarity.</li>
    </ul>
    <h3>3. Historical Recording Reference</h3>
    <p>
      The primary historical audio reference is the <em>Concertino in Third-Tones</em> for Metamorphoser Piano and Orchestra, recorded for <strong>Philips</strong> by pianist <strong>Bernard de Flavigny</strong> with the Orchestre de l'Association des Concerts Lamoureux conducted by Julián Carrillo.
    </p>
    <div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(212,175,106,0.25);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
      <span style="font-size:0.82rem;color:#aba08f;">Virtual instrument created by <a href="https://www.instagram.com/laurorobles/" target="_blank" rel="noopener noreferrer" style="color:#f2d28b;">@laurorobles</a> · <a href="https://extasisrecords.bandcamp.com" target="_blank" rel="noopener noreferrer" style="color:#f2d28b;">@extasisrecords</a></span>
      <a href="./investigacion.html" target="_blank" rel="noopener noreferrer" class="btn primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
        📄 Open Full Research Annex (HTML) ↗
      </a>
    </div>
  `,
};
