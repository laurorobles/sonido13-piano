# Recreación virtual del piano de tercios de tono de Julián Carrillo: fundamentos acústicos y arquitectura de síntesis

Para recrear de manera fiel y expresiva el **piano de tercios de tono (`18-EDO`)** de Julián Carrillo en formato virtual, la **síntesis por modelado físico híbrido —combinando síntesis modal de cuerdas, un excitador no lineal de macillo y una tabla armónica mediante red de retardos realimentados (FDN) o respuesta modal—** se perfila como la arquitectura técnica más sólida. Aunque a primera vista pudiera parecer suficiente tomar una librería de muestras de piano convencional y desafinar cada tecla a intervalos de `66.67 cents`, el instrumento físico de Carrillo —un piano de media cola de 88 teclas fabricado por la casa alemana **Carl Sauter en 1958**— obedece a una física acústica muy distinta a la de un piano temperado en 12 tonos. Comprimir 88 teclas en apenas `4.83 octavas` transforma el perfil de inarmonicidad de las cuerdas, suprime las principales vías de resonancia simpática por quintas y cuartas, y desplaza los batimientos entre teclas contiguas hacia la franja de máxima aspereza psicoacústica del oído humano.

Las demás familias de síntesis presentan compromisos importantes frente a este objetivo:
- La **síntesis FM** implementa cualquier división microtonal con un consumo mínimo de CPU, pero no reproduce de forma natural la compresión no lineal del fieltro del macillo, el decaimiento en dos etapas de coros de tres cuerdas ni la radiación de una tabla de madera de pícea, por lo que solo conviene para una reinterpretación electrónica («hiperinstrumento») en lugar de una emulación acústica.
- El **muestreo (*sampling*)** exigiría grabar directamente el ejemplar histórico conservado en San Luis Potosí —una empresa compleja por conservación y estabilidad de afinación—, mientras que desafinar muestras de un piano estándar de 12 tonos introduce artefactos acústicos ajenos al instrumento, como resonancias de pedal afinadas en quintas inexistentes y curvas de rigidez de cuerda desfasadas.
- Los **modelos neuronales y diferenciables** recientes como **DDSP-Piano** o **Piano-SSM** constituyen una vía de investigación prometedora, pero la propia literatura de DDSP-Piano señala que el modelado físico mantiene todavía la mayor calidad sonora y arquitecturas como Piano-SSM dependen de grandes corpus de audio anotado con MIDI (del orden de ~65 horas), inexistentes para un instrumento en `18-EDO`.

> [!IMPORTANT]
> **Salvedad organológica clave:** Si bien las fuentes académicas confirman que el modelo de 1958 de Carl Sauter era un piano de media cola (*baby grand*) de 88 teclas afinado en tercios de tono (`18-EDO`), **la documentación abierta disponible no precisa las frecuencias límite exactas (la nota más grave y la más aguda) ni el tiro detallado de cuerdas de esa unidad**; los planos originales de los pianos Carrillo se resguardan en el **Centro Julián Carrillo de San Luis Potosí** y en estudios aún inéditos. En consecuencia, una recreación virtual bien diseñada debe incluir una capa parametrizable que permita elegir el punto de anclaje tonal y recalibrar los parámetros físicos al registro resultante.

---

## 1. El instrumento original: historia, morfología y lógica metamorfoseadora

El piano de tercios de tono ocupa un lugar central en la materialización del ***Sonido 13*** de **Julián Carrillo (1875–1965)**. Tras registrar la patente de sus pianos microtonales en 1940, Carrillo impulsó la construcción de un primer prototipo experimental de tercios de tono en México antes de encargar la serie definitiva en Alemania; las reseñas historiográficas secundarias divergen ligeramente sobre la cronología de ese antecedente, situándolo en 1947, 1949 o hacia 1953 bajo la factura de **Federico Buschmann**, constructor del que se conservan planos de una versión vertical (*upright*).

La culminación organológica ocurrió en **1958**, cuando la firma alemana **Carl Sauter** (Spaichingen) fabricó la serie de **15 «pianos metamorfoseadores»**, presentados en la Expo 58 de Bruselas, expuestos en la Ciudad de México en 1959 y conservados hoy en el Centro Julián Carrillo de San Luis Potosí. Mientras casi todos los demás instrumentos de la colección adoptaron muebles verticales convencionales (con excepciones notorias como el piano de tonos enteros de 43 teclas o el de dieciseisavos de tono de 96 teclas, cuya extensión audible cubría una sola octava), **el piano de tercios de tono de Sauter adoptó la caja de un piano de media cola (*baby grand*) visualmente idéntico a uno convencional de 88 teclas**. Como referencia orientativa de la escuela constructiva compacta de Sauter (modelos de 160 a 185 cm), destacan tablas armónicas de pícea alpina o bávara maciza, arpa de hierro fundido, clavijero de haya, maquinaria Renner y cuerdas Röslau.

En línea con sus *Leyes de metamorfosis musicales* (1949), Carrillo conservó intencionadamente el teclado tradicional de teclas blancas y negras para que un pianista clásico pudiera ejecutar digitaciones habituales y obtener una transformación sistemática de todos los intervalos. En el piano de tercios de tono:
- Abarcar físicamente una octava tradicional del teclado (**12 intervalos de tecla**) produce **dos tercios de octava sonora (`800 cents`, equivalente a una sexta menor)**.
- Una **octava real (`2:1`)** exige recorrer **18 teclas**.
- En su **notación numérica**, `Do` es siempre `0` y los tercios de tono se escriben de `0` a `17` por octava o como múltiplos de cinco (`0, 5, 10, 15... 85`) dentro de su sistema unificado de 90 divisiones por octava.

La referencia fonográfica principal documentada es el ***Concertino en tercios de tono*** para piano «Metamorfoseador Carrillo» y orquesta (movimientos *Lento*, *Allegro* y *Vivace*), grabado en la serie francesa de **Philips** por el solista **Bernard de Flavigny** junto a la Orchestre de l'Association des Concerts Lamoureux bajo la batuta del propio compositor.

### Hipótesis matemáticas de extensión en 88 teclas

Un teclado estándar de 88 teclas contiene exactamente 87 intervalos consecutivos. Como cada paso de `18-EDO` equivale a `66.67 cents` (razón $2^{1/18} \approx 1.039259$), la extensión geométrica total queda fijada en **4 octavas y 15 tercios de tono (`4.8333 octavas`)**:

| Configuración de anclaje | Tecla de referencia | Tecla 1 (más grave) | Tecla 88 (más aguda) | Implicación pianística y acústica |
| --- | --- | --- | --- | --- |
| **Anclaje Do central** | Tecla 40 = Do4 (261.63 Hz) | 58.27 Hz (Si♭1 / MIDI 34) | 1661.22 Hz (Sol♯6 / MIDI 92) | Equilibrio óptimo en el registro central; conserva la referencia didáctica de Do = 0 en el centro del teclado. |
| **Anclaje La de concierto** | Tecla 49 = La4 (440.00 Hz) | 69.30 Hz (Do♯2 / MIDI 37) | 1975.53 Hz (Si6 / MIDI 95) | Máxima comodidad para concertar con orquesta tradicional (como en el *Concertino*), con registro superior más brillante. |
| **Inicio en La1** | Tecla 1 = La1 (55.00 Hz) | 55.00 Hz (La1 / MIDI 33) | 1567.98 Hz (Sol6 / MIDI 91) | Mantiene la primera tecla en La, exactamente una octava por encima del La0 de un piano estándar. |
| **Inicio en Do2** | Tecla 1 = Do2 (65.41 Hz) | 65.41 Hz (Do2 / MIDI 36) | 1864.66 Hz (La♯6 / MIDI 94) | Alinea el extremo grave con la convención de Do = 0 del sistema numérico de Carrillo. |
| **Inicio en La0 estándar** | Tecla 1 = La0 (27.50 Hz) | 27.50 Hz (La0 / MIDI 21) | 783.99 Hz (Sol5 / MIDI 79) | Hipótesis extrema: conserva el grave profundo pero recorta el registro agudo por encima de Sol5. |

---

## 2. Acústica y psicoacústica del 18-EDO

### 2.1 Estructura interválica y resonancia simpática
Como 18 es divisible por 6 y por 3 pero no por 12, el piano de Carrillo conserva íntegra la **escala de tonos enteros** (`3 pasos = 200 cents`, `6 pasos = 400 cents`), pero **prescinde del semitono temperado y desarticula la quinta justa (`3:2`) y la cuarta justa (`4:3`)** (sus aproximaciones de `11 pasos = 733.33¢` y `7 pasos = 466.67¢` se desvían en `±31.38¢`). En contrapartida, aproxima con gran pureza la **tercera neutra (`11:9`, error de `−14.07¢`)** y la **undécima armónica (`11:8`, error de `−17.98¢`)**.

Al pisar el pedal de resonancia, un piano de `12-EDO` genera 10 acoplamientos simpáticos fuertes en dos octavas impulsados por el tercer parcial sobre quintas y cuartas (`Fa4`, `Sol4`, `Sol5`). En `18-EDO`, esas vías desaparecen y los acoplamientos fuertes se reducen a 5, concentrados exclusivamente en las **octavas (`+18` y `+36` teclas)** y en la **décima mayor (`+24` teclas, parcial 5 con parcial 2 a `−7.36¢`)**, produciendo un halo más transparente.

### 2.2 Inarmonicidad de cuerdas de acero y aspereza sensorial
Las frecuencias de los parciales de una cuerda rígida siguen la ley:

$$
f_n = n f_0 \sqrt{1 + B n^2}, \qquad B = \frac{\pi^3 E d^4}{64 \rho L^4 f_0^2}
$$

- **Homogeneidad tímbrica:** Bajo el anclaje de `Do4` en la tecla 40, el extremo agudo culmina en `Sol♯6` (`1661.22 Hz`, $B \approx 0.00373$, desplazamiento del 2.º parcial de solo `+12.83¢` frente a `+61.54¢` en el `Do8` de un `12-EDO`), y el grave inicia en `Si♭1` (`58.27 Hz`, $B \approx 0.00018$ frente a `~0.00055` en `La0`).
- **Pico de aspereza en agudos:** Entre `Do6` y `Sol6`, el batimiento entre teclas contiguas (`41.08` a `61.56 Hz`) alcanza una razón $\Delta f / \text{CBW}$ de `0.245` a `0.262` —en torno al máximo clásico de aspereza sensorial (`~0.25 CBW`)—, exigiendo una anchura de unísono (*unison width*) estrecha y dureza de macillo controlada.

---

## 3. Comparativa de arquitecturas de síntesis

1. **Modelado físico híbrido (elegido en este proyecto):** La síntesis modal paralela (Bank, Zambon & Fontana, 2010) permite fijar exactamente $f_n$ y $T_{60}(n)$ para las 88 notas en `18-EDO`, combinada con un excitador no lineal tipo Stulov, acoplamiento simpático real en el puente y una tabla armónica FDN.
2. **Guías de onda digitales (DWG):** Muy eficientes en CPU, pero exigen delicadas redes de filtros *allpass* de dispersión para reproducir con exactitud la curva $B$ de 88 cuerdas microtonales.
3. **Diferencias finitas / Elementos finitos (FDTD / FEM):** Máximo rigor físico desde primeros principios (Chabassier, Chaigne, Bilbao), idóneas como referencia fuera de línea para calibrar el motor modal en tiempo real.
4. **FM, Muestreo y Redes Neuronales (DDSP-Piano / Piano-SSM):** Útiles respectivamente para timbres electroacústicos experimentales, registro documental in situ (aún inexistente en fuentes abiertas) o futura investigación diferenciable, pero con limitaciones acústicas o de datos frente al modelado físico directo.

---

## 4. Bibliografía y fuentes principales

- Bank, B., Zambon, S., & Fontana, F. (2010). *A Modal-Based Real-Time Piano Synthesizer*. IEEE Transactions on Audio, Speech, and Language Processing, 18(4), 809–821.
- Bank, B. (2006). *Physics-Based Sound Synthesis of the Piano*. Tesis doctoral, Budapest University of Technology and Economics (BME).
- Cannon-Brown, W. (2024). *Julián Carrillo, Laws of Musical Metamorphosis, and the Metamorphoser Pianos*. Music Theory Online, 30(4). https://mtosmt.org/issues/mto.24.30.4/mto.24.30.4.cannon-brown.html
- Carrillo, J. (1949). *Leyes de metamorfosis musicales*. Ciudad de México.
- Chabassier, J., Chaigne, A., & Joly, P. (2013). *Modeling and simulation of a grand piano*. Journal of the Acoustical Society of America (JASA).
- Dallinger, D., et al. (2025). *Piano-SSM: Diagonal State Space Models for Efficient MIDI-to-Raw Audio Synthesis*. Proceedings of DAFx25.
- Galván, A. (2018). *Aproximación a la obra microinterválica de Julián Carrillo*. Tesis de maestría, Universidad Autónoma de San Luis Potosí (UASLP).
- Madrid, A. L. (2015). *In Search of Julián Carrillo and Sonido 13*. Oxford University Press.
- Michon, R., & Smith, J. O. (2018). *The Faust Physical Modeling Library: a Modular Playground for the Digital Luthier*. IFC-18.
- Renault, L., Mignot, R., & Roebel, A. (2023). *DDSP-Piano: A Neural Sound Synthesizer Informed by Instrument Knowledge*. Journal of the Audio Engineering Society (JAES).
