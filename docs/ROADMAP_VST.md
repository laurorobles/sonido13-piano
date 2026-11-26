# Plan de Trabajo y Hoja de Ruta: Sonido 13 Piano VST3 / AU / CLAP

Este documento define la arquitectura de ingeniería y el plan en 5 fases para llevar **Sonido 13 · Piano Metamorfoseador Virtual** desde su motor actual en `Web Audio API` (`AudioWorklet`) hacia un plugin nativo de 64 bits (**VST3, Audio Unit v2, CLAP y aplicación Standalone**) para macOS (Apple Silicon / Intel) y Windows (x64) empleando **C++20 y JUCE 8**.

---

## 1. Ventaja arquitectónica de partida

Al igual que en el proyecto hermano **Omnifón**, el núcleo acústico de `sonido13-piano` ya opera en tiempo real muestra por muestra sin depender de nodos cerrados del navegador:

1. **Aritmética pura lista para C++20 / SIMD:** Los resonadores fasoriales de 2.º orden (`cosW`, `sinW`, `re`, `im`), la ley de rigidez $B(f_0)$, el excitador no lineal de macillo y la matriz Hadamard FDN de 4 canales en `public/piano-worklet.js` son directamente traducibles a `float`/`double` vectorizados (`AVX2` / `ARM NEON` con `juce::dsp::SIMDRegister`).
2. **Interfaz híbrida probada (`juce::WebBrowserComponent`):** Siguiendo el patrón de Omnifón v1.4, toda la interfaz gráfica educativa (arpa Sauter en `Canvas 2D`, rollo de pianola, círculo armónico, inspector de metamorfosis y anexo HTML) puede empaquetarse en `BinaryData` con sincronización bidireccional a 60 fps.

---

## 2. Prestaciones exclusivas de la versión nativa DAW

Además de todas las funciones de la versión web, el plugin nativo incorporará tres estándares clave para producción microtonal contemporánea:

- **Soporte ODDSound MTS-ESP (Cliente y Maestro opcional):** Permite sincronizar dinámicamente la tabla de frecuencias de `18-EDO` / `24-EDO` / `96-EDO` con otros sintetizadores y pistas dentro de Ableton Live, Reaper, Bitwig, Logic Pro o Cubase.
- **Compatibilidad MPE y MIDI 2.0:** Expresión polifónica por nota (deslizamiento microtonal continuo, velocidad de alta resolución de 16 bits y control de apagador individual).
- **Motor modal ampliado (64 voces × 24 modos transversales + 4 modos longitudinales) con integración de macillo de Stulov multitasa ($4\times$ oversampling local durante el contacto).**

---

## 3. Arquitectura C++20 + JUCE 8

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                       Sonido13AudioProcessor                            │
│        (juce::AudioProcessor + juce::AudioProcessorValueTreeState)      │
├─────────────────────────────────────────────────────────────────────────┤
│  • TuningEngineCPP (.scl/.kbm + 5 anclajes + MTS-ESP Client)            │
│  • StulovHammerIntegrator (4x local oversampling, histéresis fieltro)   │
│  • SIMDModalStringBank (64 voces × 28 modos vectorizados AVX2 / NEON)   │
│  • SympatheticBridgeMatrix (acoplamiento espectral entre cuerdas libres)│
│  • SpruceSoundboardFDN8 (8 líneas Hadamard + convolución corta de tapa) │
├─────────────────────────────────────────────────────────────────────────┤
│                     Sonido13AudioProcessorEditor                        │
│  • juce::WebBrowserComponent (UI idéntica a la versión web en 60 fps)   │
│  • Sincronización de Pianola al BPM / PPQ / Transport del DAW           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Plan de ejecución en 5 fases

### Fase 1: Núcleo Modal C++20 y Macillo de Stulov con Histéresis
- [ ] Configurar `vst/CMakeLists.txt` con JUCE 8 (`VST3`, `AU`, `Standalone`) y soporte CI en GitHub Actions (macOS Universal + Windows x64 WebView2).
- [ ] Implementar `SIMDModalVoice`: procesamiento simultáneo de 4 u 8 modos por instrucción SIMD, elevando el techo a 64 voces polifónicas con `< 5%` de CPU en Apple M-series.
- [ ] Incorporar integración explícita de fuerza de contacto $F(t) = k\,\Delta y(t)^p + \mu \frac{\partial}{\partial t}\Delta y(t)^p$ a $4\times f_s$ durante los primeros milisegundos del golpeo, más modos longitudinales agudos en ataques *fortissimo*.

### Fase 2: Microtonalidad Avanzada (MTS-ESP, `.scl/.kbm` y MPE)
- [ ] Integrar la librería abierta `libMTSClient` (ODDSound MTS-ESP) con conmutador entre afinación interna Sauter (`18/24/6/96-EDO`) y maestro MTS-ESP externo.
- [ ] Importador/exportador nativo de archivos `.scl` y `.kbm` desde disco.
- [ ] Soporte completo MPE y MIDI 2.0.

### Fase 3: Puente UI WebView2 / WebKit y Sincronización DAW
- [ ] Empaquetar `dist/` dentro del binario del plugin y enlazar todos los parámetros mediante `APVTS` para automatización completa en pistas del DAW.
- [ ] Sincronizar la **Pianola Animada** con el reloj (`AudioPlayHead`) del DAW y permitir arrastrar cualquier obra de la pianola como clip MIDI/MPE hacia una pista del DAW.

### Fase 4: Calibración Empírica y Respuesta Impulsional de Pícea
- [ ] Calibración de curvas de envolvente y balance espectral contrastadas con grabaciones históricas del *Concertino en tercios de tono* (Philips, 1958) y simulaciones de cuerda rígida FDTD fuera de línea.
- [ ] Opción de radiación híbrida FDN + respuesta modal derivada por elementos finitos (`mesh2faust` / placa ortótropa de pícea alpina).

### Fase 5: Validación en Hosts, Firma de Código e Instaladores
- [ ] Verificación con `pluginval` (nivel estricto 10) en Logic Pro, Ableton Live 12, Reaper 7 y Bitwig Studio 5.
- [ ] Publicación automatizada de paquetes `.zip` / `.pkg` en GitHub Releases.
