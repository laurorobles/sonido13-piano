# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

## [1.1.0] — 2026-11-26

### Rediseño de consola centrada de geometría fija y fichas musicológicas extendidas
- **Consola centrada de estudio (`max-width: 1100px`):** Proporciones contenidas con márgenes laterales simétricos y jerarquía visual donde el mueble Carl Sauter 1958 ocupa el plano protagonista inmediato.
- **Cero saltos de layout (`0 px jitter`):**
  - El visor del atril (`#notation-hud`), el inspector de metamorfosis (`#metamorph-box`), el ticker didáctico en vivo (`#live-ticker`) y los botones de transporte utilizan rejillas fijas y tipografía tabular (`tabular-nums`), actualizando únicamente nodos de texto en sitio sin alterar el ancho ni la altura de ningún módulo.
  - Prevención de condiciones de carrera concurrentes durante la carga asíncrona inicial de `AudioWorklet`.
- **Fichas musicológicas y acústicas extendidas para las 10 obras (`.piece-dossier-card`):**
  - Cada obra incorpora etiquetas técnicas rápidas y tres columnas analíticas bilingües (`ES` / `EN`): *1. Contexto Histórico y Repertorio*, *2. Análisis Interválico y Acústico* y *3. Experimento de Escucha Activa*.

## [1.0.0] — 2026-11-26

Primera versión pública oficial de **Sonido 13 · Piano Metamorfoseador Virtual**, reconstrucción interactiva en navegador del piano de tercios de tono (`18-EDO`) concebido por **Julián Carrillo** y fabricado por **Carl Sauter** en 1958.

### Agregado
- **Motor acústico de modelado físico híbrido en `AudioWorklet` (`public/piano-worklet.js`):**
  - Banco modal paralelo de hasta **28 voces polifónicas × 10 modos inarmónicos** con curva física de rigidez $B(f_0)$ calibrada para un media cola alemán de cámara (~165–185 cm) comprimido en 4.83 octavas (`0.00018` a `0.00373`).
  - Coro doble desafinado con control fino de **anchura de unísono (*unison width*)** para preservar el decaimiento en dos etapas sin enturbiar los intervalos de `66.67 cents` cerca del pico de aspereza psicoacústica (`~0.25 CBW`).
  - **Excitador no lineal de macillo** inspirado en la ley de histéresis de Stulov, sensible a la velocidad y dureza del fieltro.
  - **Resonancia simpática emergente** dependiente del EDO activo al pisar el pedal de resonancia (acoplamiento limpio en octavas `±18`, `±36` y décima mayor `+24` en `18-EDO`, frente a las quintas y cuartas del modo `12-EDO`).
  - **Tabla armónica de pícea alpina** modelada con una red de retardos realimentados (**FDN Hadamard de 4 canales**) con filtros paso-bajos de absorción y panoramización natural de graves a agudos.
- **Colección de 5 variantes históricas intercambiables (Carl Sauter, 1958):**
  - `Tercios de Tono (18-EDO · 88 teclas · 4.83 octavas)` *(instrumento principal, media cola)*.
  - `Cuartos de Tono (24-EDO · 88 teclas · 3.63 octavas)`.
  - `Tonos Enteros (6-EDO · 43 teclas · 7.0 octavas)`.
  - `Dieciseisavos de Tono (96-EDO · 96 teclas · 1.0 octava Do4–Do5)`.
  - `Piano Estándar (12-EDO · 88 teclas · 7.25 octavas)` para comparación acústica A/B instantánea.
- **5 hipótesis matemáticas de anclaje tonal en 88 teclas** (*Do central en tecla 40*, *La4 de concierto en tecla 49*, *Inicio en La1*, *Inicio en Do2* e *Inicio en La0 estándar*) + curva de estiramiento de octavas **Railsback** ajustable.
- **Interfaz física inspirada en el media cola Carl Sauter de 1958:**
  - Tapa abierta en `Canvas 2D` con tabla de pícea, arpa dorada de hierro fundido, puente y cuerdas de cobre/acero que vibran y resuenan simpáticamente en tiempo real, más trazo de forma de onda acústica.
  - Teclado de 88/43/96 teclas con marcadores dorados de octava real (`Grado 0`), números de Carrillo opcionales, guía de teclado de computadora (`A–Ñ` + cambio de registro `Z`/`X`), zoom continuo (`100%–260%`), glissando táctil/ratón, **Web MIDI** y 3 pedales de latón (*Una Corda*, *Sostenuto*, *Resonancia*).
- **Pianola Animada con Rollo de Notas y 10 Obras/Estudios comentados en vivo:**
  - `1 · Concertino en Tercios de Tono (1958)`, `2 · Metamorfosis I: Preludio en Do (J. S. Bach)`, `3 · Preludio a Colón (1922)`, `4 · Balbuceos (96-EDO, 1958)`, `5 · Metamorfosis II: Claro de Luna (Beethoven)`, `6 · Estudio de 3ª Neutra (11:9) y 11ª (11:8)`, `7 · Prisma Hexagonal (6-EDO)`, `8 · Horizontes (24-EDO)`, `9 · Espejos Simpáticos` y `10 · Escala Maestra del Sonido 13 (Tour Guiado)`.
  - Conmutador **`⇄ Comparar A/B: 18-EDO ↔ 12-EDO`** en tiempo real sin detener la reproducción.
- **Herramientas educativas e investigación documental:**
  - **Inspector de Metamorfosis en Vivo**, **Círculo Armónico de la Octava (SVG)**, **Laboratorio Acústico 18-EDO**, **Guía Interactiva**, exportador nativo **Scala (`.scl` / `.kbm`)** e interfaz bilingüe completa (`ES` / `EN`).
  - Anexo documental íntegro en HTML (`public/investigacion.html`) y documentación técnica completa (`docs/INVESTIGACION.md`, `docs/MANUAL.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP_VST.md`, `CITATION.cff`).
