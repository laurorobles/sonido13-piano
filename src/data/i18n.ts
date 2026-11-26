export type Lang = 'es' | 'en';

export const UI_TEXT = {
  es: {
    brandTitle: 'SONIDO 13 · PIANO METAMORFOSEADOR',
    brandSub: 'El piano mexicano que esconde notas nuevas entre las teclas de siempre · Julián Carrillo (1958)',
    creditBy: 'Recreación virtual por',
    researchBtn: 'Historia',
    guideBtn: 'Cómo funciona',
    labBtn: 'Probar sonidos',
    midiBtn: 'MIDI',
    midiConnected: 'MIDI listo',
    variantLabel: '1. Elige qué piano quieres tocar',
    anchorLabel: '2. Registro del teclado (Graves / Agudos)',
    pianolaTitle: '3. Pianola Animada',
    repertoireStripLabel: 'Piezas para escuchar',
    autoSwitchVariant: 'Cambiar al piano ideal de cada pieza',
    abToggleBtn: '⇄ Comparar: Carrillo ↔ Normal',
    abActive12: '⇄ Sonando Normal (Volver)',
    play: 'Escuchar',
    pause: 'Pausar',
    stop: 'Detener',
    speed: 'Velocidad',
    exportScl: '.scl/.kbm',
    showCarrilloNums: 'Ver números de Carrillo en teclas',
    showQwertyHints: 'Ver letras del teclado de tu compu',
    acousticTitle: 'Personaliza el interior del piano (Fieltro, Cuerdas y Madera)',
    hammer: 'Suavidad del martillo',
    hammerTip: 'Más bajo suena dulce y aterciopelado; más alto suena brillante y firme',
    unison: 'Vibración entre cuerdas',
    unisonTip: 'Cada tecla golpea 3 cuerdas juntas: bájalo para máxima pureza o súbelo para más cuerpo',
    sympathetic: 'Eco de cuerdas libres',
    sympatheticTip: 'Al pisar el pedal, las demás cuerdas del arpa empiezan a cantar solas por simpatía',
    inharmonicity: 'Cuerpo metálico',
    inharmonicityTip: 'El brillo natural que tienen las cuerdas reales de acero y cobre',
    railsback: 'Ajuste de extremos',
    railsbackTip: 'Pequeño retoque de afinador para que los graves y agudos se oigan redondos',
    soundboard: 'Resonancia de madera',
    soundboardTip: 'Cuánto se siente el abrazo cálido de la caja de madera de abeto',
    volume: 'Volumen general',
    notationTitle: '¿Qué nota estás tocando?',
    notationEmpty: 'Toca cualquier tecla o dale a ▶ Escuchar arriba',
    stepLabel: 'Nota Carrillo',
    scale90Label: 'Escala de 90',
    freqLabel: 'Vibraciones',
    nearest12Label: 'Nota conocida',
    inharmLabel: 'Color cuerda',
    keyVisualLabel: 'Tecla tocada',
    pedalUnaCorda: 'Pedal suave (Shift)',
    pedalSostenuto: 'Sostenuto',
    pedalSustain: 'Pedal de eco / Sustain (Espacio)',
    eduMetamorphTitle: '¿Cómo transforma este piano lo que tocas?',
    eduCircleTitle: 'Reloj de Notas de la Octava',
    eduIntervalIdle: 'Toca dos teclas para comparar',
    eduVisualSpan: 'Teclas de distancia',
    eduNormalPiano: 'En un piano común sonaría',
    eduSoundingHere: 'En este piano suena',
    eduOctaveLegend: '● Punto dorado = Aquí vuelve a empezar el ciclo (Nota Do = 0)',
    listenForPrefix: 'Fíjate en esto:',
    footerShortcuts:
      'Toca con tu teclado: letras <kbd>A</kbd>–<kbd>Ñ</kbd> · <kbd>Z</kbd>/<kbd>X</kbd> mover hacia graves o agudos · <kbd>Espacio</kbd> pedal para dejar sonando las notas · Con el ratón puedes arrastrar sobre las teclas.',
    footerDisclaimer:
      'Instrumento virtual educativo inspirado en los pianos que el compositor mexicano Julián Carrillo mandó construir con Carl Sauter en 1958, hoy conservados en San Luis Potosí.',
    labTitle: 'Escucha la diferencia en 4 ejemplos sencillos',
    guideTitle: '¿Qué tiene de especial este piano? (Explicado fácil)',
    close: 'Cerrar',
    compare18: 'Escuchar en Piano de Carrillo',
    compare12: 'Escuchar en Piano Normal',
  },
  en: {
    brandTitle: 'SONIDO 13 · METAMORPHOSER PIANO',
    brandSub: 'The Mexican piano hiding brand-new notes inside familiar keys · Julián Carrillo (1958)',
    creditBy: 'Virtual recreation by',
    researchBtn: 'Story & Info',
    guideBtn: 'How It Works',
    labBtn: 'Try Sounds',
    midiBtn: 'MIDI',
    midiConnected: 'MIDI Ready',
    variantLabel: '1. Pick which piano to play',
    anchorLabel: '2. Keyboard range (Low / High)',
    pianolaTitle: '3. Animated Player Piano',
    repertoireStripLabel: 'Pieces to explore',
    autoSwitchVariant: 'Auto-pick each piece’s ideal piano',
    abToggleBtn: '⇄ Compare: Carrillo ↔ Normal',
    abActive12: '⇄ Normal Piano (Switch back)',
    play: 'Listen',
    pause: 'Pause',
    stop: 'Stop',
    speed: 'Speed',
    exportScl: '.scl/.kbm',
    showCarrilloNums: 'Show Carrillo numbers on keys',
    showQwertyHints: 'Show computer keyboard letters',
    acousticTitle: 'Shape the piano’s physical body (Felt, Strings & Wood)',
    hammer: 'Hammer softness',
    hammerTip: 'Lower feels warm and mellow; higher sounds bright and crisp',
    unison: 'String chorus',
    unisonTip: 'Each key strikes 3 strings together: lower for pure clarity, higher for lush warmth',
    sympathetic: 'Free-string echo',
    sympatheticTip: 'When holding the pedal, other strings across the harp sing along on their own',
    inharmonicity: 'Metallic ring',
    inharmonicityTip: 'The natural shimmer of real tensioned steel and copper strings',
    railsback: 'Extreme tuning',
    railsbackTip: 'Subtle piano-tuner stretch so the deepest lows and highest highs sound sweet',
    soundboard: 'Wood resonance',
    soundboardTip: 'How much the warm spruce wood body embraces the sound',
    volume: 'Master volume',
    notationTitle: 'What note are you playing?',
    notationEmpty: 'Click any key or press ▶ Listen above',
    stepLabel: 'Carrillo Note',
    scale90Label: 'Scale of 90',
    freqLabel: 'Vibrations',
    nearest12Label: 'Closest normal note',
    inharmLabel: 'String tone',
    keyVisualLabel: 'Key pressed',
    pedalUnaCorda: 'Soft pedal (Shift)',
    pedalSostenuto: 'Sostenuto',
    pedalSustain: 'Sustain / Echo pedal (Space)',
    eduMetamorphTitle: 'How does this piano transform what you play?',
    eduCircleTitle: 'Octave Note Clock',
    eduIntervalIdle: 'Play two keys to compare',
    eduVisualSpan: 'Keys apart',
    eduNormalPiano: 'On a normal piano',
    eduSoundingHere: 'On this piano',
    eduOctaveLegend: '● Gold dot = The cycle starts over here (True C = 0)',
    listenForPrefix: 'Listen for this:',
    footerShortcuts:
      'Play with your computer keyboard: letters <kbd>A</kbd>–<kbd>;</kbd> · <kbd>Z</kbd>/<kbd>X</kbd> move lower or higher · <kbd>Space</kbd> hold sustain pedal · Drag your mouse across keys to glide.',
    footerDisclaimer:
      'Educational virtual instrument inspired by the custom pianos Mexican composer Julián Carrillo commissioned from Carl Sauter in 1958, preserved in San Luis Potosí.',
    labTitle: 'Hear the difference in 4 simple examples',
    guideTitle: 'What makes this piano special? (In plain words)',
    close: 'Close',
    compare18: 'Switch to Carrillo Piano',
    compare12: 'Switch to Normal Piano',
  },
} as const;

export const GUIDE_HTML = {
  es: `
    <p class="lead">
      Por fuera se ve idéntico a un piano común de 88 teclas blancas y negras, pero al tocarlo descubrirás un truco fascinante inventado por el músico mexicano <strong>Julián Carrillo</strong>: <strong>hay sonidos nuevos escondidos donde antes no cabían</strong>.
    </p>
    <div class="lab-grid">
      <div class="lab-card">
        <h4>1. Imagina una escalera con más escalones</h4>
        <p>En un piano normal, para subir de un <em>Do</em> al siguiente <em>Do</em> más agudo (una octava) subes <strong>12 escalones</strong>. En este piano la misma altura se divide en <strong>18 escalones más bajitos</strong>. Son notas intermedias que en los pianos normales simplemente no existen.</p>
      </div>
      <div class="lab-card">
        <h4>2. ¿Por qué dejó las mismas teclas de siempre?</h4>
        <p>Para que cualquiera pudiera tocarlo sin tener que aprender un instrumento raro desde cero. Si tocas una canción conocida usando tus mismos dedos de siempre, el piano la <strong>"metamorfosea"</strong> (la redibuja con colores nuevos).</p>
      </div>
      <div class="lab-card">
        <h4>3. Sigue los puntos dorados (el número 0)</h4>
        <p>Como ahora hacen falta <strong>18 teclas</strong> para llegar al siguiente <em>Do</em>, las teclas blancas ya no coinciden con Do-Re-Mi. Por eso Carrillo les puso números sencillos: <strong>el <code>0</code> con punto dorado marca cada nuevo Do</strong>, y luego cuentas del <code>1</code> al <code>17</code>.</p>
      </div>
      <div class="lab-card">
        <h4>4. La prueba más divertida (en 5 segundos)</h4>
        <p>Arriba elige <strong>2 · Bach Metamorf.</strong> o <strong>5 · Claro de Luna</strong>, dale a <strong>▶ Escuchar</strong> y mientras suena aprieta el botón verde <strong>⇄ Comparar</strong>. ¡Vas a oír cómo la pieza cambia de universo en tiempo real!</p>
      </div>
    </div>
  `,
  en: `
    <p class="lead">
      On the outside it looks just like a classic 88-key piano, but the moment you touch it you’ll hear a clever trick invented by Mexican composer <strong>Julián Carrillo</strong>: <strong>brand-new notes tucked right in between the familiar ones</strong>.
    </p>
    <div class="lab-grid">
      <div class="lab-card">
        <h4>1. Picture a staircase with smaller steps</h4>
        <p>On a normal piano, climbing from one <em>C</em> to the next higher <em>C</em> (an octave) takes <strong>12 steps</strong>. On this piano, that exact same climb is split into <strong>18 gentler steps</strong>—unlocking expressive "in-between" colors standard pianos skip right over.</p>
      </div>
      <div class="lab-card">
        <h4>2. Why keep normal white &amp; black keys?</h4>
        <p>So anyone could sit down and play right away! When you play a familiar tune using your usual finger shapes, the piano automatically <strong>"metamorphoses"</strong> it into a brand-new sonic landscape.</p>
      </div>
      <div class="lab-card">
        <h4>3. Follow the gold dots (Note 0)</h4>
        <p>Because it now takes <strong>18 keys</strong> to reach the next <em>C</em>, traditional note names don’t line up anymore. Carrillo solved this with simple numbers: <strong>every gold dot with <code>0</code> marks a true C</strong>, counting <code>0</code> through <code>17</code>.</p>
      </div>
      <div class="lab-card">
        <h4>4. The most fun 5-second test</h4>
        <p>Pick <strong>2 · Bach Metamorph.</strong> or <strong>5 · Moonlight</strong> at the top, hit <strong>▶ Listen</strong>, and click the green <strong>⇄ Compare</strong> button while it plays to hear the music shift worlds instantly!</p>
      </div>
    </div>
  `,
};

export const RESEARCH_HTML = {
  es: `
    <h2>La aventura de Julián Carrillo y su «Sonido 13»</h2>
    <p class="lead">
      En 1895, siendo un joven estudiante de violín en México, <strong>Julián Carrillo (1875–1965)</strong> deslizó el filo de una navaja sobre una cuerda de su violín y descubrió que el oído humano podía distinguir muchísimas notas diminutas dentro de un solo tono. Llamó a ese hallazgo el <strong>Sonido 13</strong>: romper el límite de las 12 notas tradicionales de Occidente.
    </p>
    <div class="info-photo-grid">
      <figure class="info-figure">
        <img src="./images/julian-carrillo.jpg" alt="Retrato histórico autografiado de Julián Carrillo en París (1899)" />
        <figcaption>
          <strong>Julián Carrillo Trujillo (1875–1965)</strong><br />
          Retrato autografiado en París en 1899, apenas cuatro años después de su célebre experimento con la cuerda de violín en la Ciudad de México. <em>Fuente: Wikimedia Commons.</em>
        </figcaption>
      </figure>
      <figure class="info-figure">
        <img src="./images/sauter-metamorfoseador.jpg" alt="Piano Metamorfoseador Carl Sauter conservado en el Centro Julián Carrillo de San Luis Potosí" style="object-position:center 48%" />
        <figcaption>
          <strong>Uno de los pianos originales Carl Sauter (1958)</strong><br />
          Conservado hoy en el <strong>Centro Julián Carrillo</strong> en San Luis Potosí, con el sello dorado <em>Sauter</em> y el medallón del maestro a la derecha. <em>Foto: W. Cannon-Brown (2024).</em>
        </figcaption>
      </figure>
    </div>
    <h3>Los 15 pianos mágicos de Bruselas (1958)</h3>
    <p>
      Durante décadas muchos pensaron que era imposible llevar esas micro-notas a un piano. En <strong>1958</strong>, Carrillo lo logró a lo grande junto al prestigioso taller alemán <strong>Carl Sauter</strong>: construyeron <strong>15 «pianos metamorfoseadores»</strong> que causaron sensación en la Exposición Universal de Bruselas y en París (donde grabó su <em>Concertino en tercios de tono</em> con el pianista Bernard de Flavigny).
    </p>
    <p>
      Mientras la mayoría eran pianos verticales (incluyendo uno asombroso cuyas 96 teclas enteras caben dentro de una sola octava), <strong>el piano de tercios de tono fue construido como un elegante piano de media cola de 88 teclas</strong>.
    </p>
    <h3>¿Por qué simulamos la madera y las cuerdas en vez de usar grabaciones?</h3>
    <p>
      Si tomas grabaciones de un piano común y solo les cambias el tono por computadora, suena artificial porque un piano real es un cuerpo vivo donde todas las cuerdas vibran juntas. Al meter 88 cuerdas en menos de 5 octavas:
    </p>
    <ul>
      <li><strong>Las cuerdas cantan más parejas:</strong> No hay cuerdas ultracortas chillonas ni cables exageradamente gruesos; todo el piano suena cálido y equilibrado.</li>
      <li><strong>Un eco más cristalino al pisar el pedal:</strong> Al no existir algunos acordes habituales del piano común, cuando pisas el pedal las demás cuerdas responden con un brillo mucho más limpio y transparente.</li>
    </ul>
    <div class="callout">
      <strong>Nota curiosa sobre las 5 afinaciones disponibles:</strong> Como los planos detallados de fábrica siguen resguardados en archivo en San Luis Potosí, incluimos en el menú superior las 5 maneras históricas más lógicas de acomodar las notas en las 88 teclas para que puedas explorarlas todas.
    </div>
    <div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(212,175,106,0.25);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
      <span style="font-size:0.82rem;color:#aba08f;">Recreación virtual por <a href="https://www.instagram.com/laurorobles/" target="_blank" rel="noopener noreferrer" style="color:#f2d28b;">@laurorobles</a> · <a href="https://extasisrecords.bandcamp.com" target="_blank" rel="noopener noreferrer" style="color:#f2d28b;">@extasisrecords</a></span>
      <a href="./investigacion.html" target="_blank" rel="noopener noreferrer" class="btn primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
        📄 Ver Anexo de Investigación Académica Completo ↗
      </a>
    </div>
  `,
  en: `
    <h2>Julián Carrillo’s Quest for the “13th Sound”</h2>
    <p class="lead">
      In 1895, as a young violin student in Mexico City, <strong>Julián Carrillo (1875–1965)</strong> slid the edge of a pocketknife along a violin string and realized the human ear could hear dozens of tiny, expressive notes inside a single whole step. He called this breakthrough <strong>Sonido 13</strong> ("The 13th Sound")—breaking past Western music’s 12-note ceiling.
    </p>
    <div class="info-photo-grid">
      <figure class="info-figure">
        <img src="./images/julian-carrillo.jpg" alt="Autographed historical portrait of Julián Carrillo in Paris (1899)" />
        <figcaption>
          <strong>Julián Carrillo Trujillo (1875–1965)</strong><br />
          Autographed portrait in Paris (1899), just four years after his famous violin-string experiment in Mexico City. <em>Source: Wikimedia Commons.</em>
        </figcaption>
      </figure>
      <figure class="info-figure">
        <img src="./images/sauter-metamorfoseador.jpg" alt="Carl Sauter Metamorphoser Piano at the Centro Julián Carrillo in San Luis Potosí" style="object-position:center 48%" />
        <figcaption>
          <strong>An original Carl Sauter piano (1958)</strong><br />
          Preserved today at the <strong>Centro Julián Carrillo</strong> in San Luis Potosí, showing the gold <em>Sauter</em> script and Carrillo’s bronze medallion. <em>Photo: W. Cannon-Brown (2024).</em>
        </figcaption>
      </figure>
    </div>
    <h3>The 15 Wonder Pianos of Brussels (1958)</h3>
    <p>
      For decades skeptics claimed microtones could never work on a piano. In <strong>1958</strong>, Carrillo proved them wrong alongside renowned German maker <strong>Carl Sauter</strong>, unveiling <strong>15 custom "metamorphoser pianos"</strong> that amazed audiences at the Brussels World’s Fair and in Paris (where pianist Bernard de Flavigny recorded Carrillo’s <em>Concertino in Third-Tones</em>).
    </p>
    <p>
      While most were uprights (including a jaw-dropping 96-key model whose entire keyboard zooms into one single octave), <strong>the third-tone piano was built as an elegant 88-key baby grand</strong>.
    </p>
    <h3>Why simulate real wood &amp; strings instead of using recordings?</h3>
    <p>
      Simply pitch-shifting recordings of a normal piano sounds fake because a real piano is a living wooden body where every string listens to the others. Packing 88 strings into under 5 octaves changes its voice naturally:
    </p>
    <ul>
      <li><strong>Smoother, warmer tone end-to-end:</strong> Without ultra-short high strings or super-thick bass coils, the whole keyboard sings with balanced chamber warmth.</li>
      <li><strong>A clearer echo when holding the pedal:</strong> Because its strings line up in a fresh geometry, pressing the sustain pedal creates a transparent, bell-clear halo instead of a heavy cloud.</li>
    </ul>
    <div class="callout">
      <strong>Why are there 5 range options?</strong> Because the factory stringing blueprints remain unpublished in San Luis Potosí’s archives, the top menu lets you explore the 5 most natural historical ways to place those notes across the 88 keys.
    </div>
    <div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(212,175,106,0.25);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
      <span style="font-size:0.82rem;color:#aba08f;">Virtual instrument by <a href="https://www.instagram.com/laurorobles/" target="_blank" rel="noopener noreferrer" style="color:#f2d28b;">@laurorobles</a> · <a href="https://extasisrecords.bandcamp.com" target="_blank" rel="noopener noreferrer" style="color:#f2d28b;">@extasisrecords</a></span>
      <a href="./investigacion.html" target="_blank" rel="noopener noreferrer" class="btn primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
        📄 Open Full Academic &amp; Acoustic Research Annex ↗
      </a>
    </div>
  `,
};
