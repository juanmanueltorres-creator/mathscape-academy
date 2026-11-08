# Mathscape Academy V0.2 — The Mathematical Playground

**Estado:** desarrollo local / rama de revisión. Sin despliegue público, sin backend y sin Blender.

Experiencia en React + TypeScript + Vite con gráficos científicos y matemáticas verificables. Recupera los experimentos generativos iniciales (Lissajous, Lorenz y superfórmula) y va más allá de una colección de tarjetas: **nueve escenas interactivas**, controles matemáticos, desafíos y comparación entre aproximaciones y soluciones exactas.

## Explorar

| N.º | Experimento | Interacción |
|---|---|---|
| 00 | Atlas generativo | Frecuencias de Lissajous, fase, alternar sistemas visuales y rotación |
| 01 | Funciones | Parámetros de la cuadrática y comparación con seno |
| 02 | Límites | `sin(x)/x` y aproximación bilateral a cero |
| 03 | Derivadas | Secante y tangente en `f(x)=x²` |
| 04 | Integrales definidas | Rectángulos de Riemann izquierdos |
| 05 | **Integrales dobles** | Superficie `z=1+a(x²+y²)` sobre un cuadrado, suma de puntos medios n×n |
| 06 | Matrices | Transformación 2×2, grilla y determinante |
| 07 | **Ecuaciones diferenciales** | `y'=ky`, Euler explícito y solución exacta |
| 08 | **Derivadas parciales** | Gradiente de un paraboloide sobre superficie rotatoria |

## Ejecutar

```bash
npm install
npm run dev
npm test
npm run build
```

La URL dev se abrirá desde la terminal Vite. No se despliega automáticamente.

## Arquitectura

- `src/main.tsx` — shell y estado React, navegación, controles accesibles, progresión.
- `src/content.ts` — programa de escenas y controles, editable sin cambiar el motor.
- `src/math.ts` — algoritmos puros y funciones exactas.
- `src/measure.ts` — métricas, error, fórmulas y validaciones de desafíos.
- `src/visuals.ts` — dibujo Canvas 2D, proyección de superficies 3D sobre 2D.
- `src/styles.css` — dirección visual, responsive, contrastes.
- `tests/advanced.test.mjs` — pruebas matemáticas de cálculo avanzado.

### Criterios de corrección

1. Los valores de la UI provienen de las mismas funciones puras que los gráficos.
2. El módulo de integral doble usa suma de Riemann de puntos medios con área de celda `(2b/n)²`. El valor exacto es `4b²+(8/3)ab⁴`.
3. La escena EDO representa Euler explícito y compara el mismo modelo con `y0·exp(k t)`.
4. La proyección de superficies es una **vista 2.5D**, no una escena WebGL; la posición/altura corresponde a la función indicada.
5. Las formas generativas son un lenguaje visual experimental, no una interpretación científica de datos externos.
6. `demo.html` es una **demo anterior** de V0.1 conservada por compatibilidad; la versión actual y completa corre con Vite/React.

## Camino educativo

Repaso breve → límites → derivadas e integrales → matrices → superficies, derivadas parciales e integrales dobles → ecuaciones diferenciales → aplicaciones geoespaciales.

Fuentes de referencia: [OpenStax Cálculo](https://openstax.org/subjects/math), [MIT Single Variable Calculus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/), [MIT Multivariable Calculus](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/) y [MIT Linear Algebra](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/).

## Pendiente

- Evaluar comprensión pedagógica con usuarios reales.
- Agregar vistas WebGL sólo si aportan manipulación tridimensional que Canvas 2D no pueda ofrecer.
- Nunca ejecutar un despliegue sin una instrucción explícita.


## V0.3 · rendimiento, familias y refinamiento visual

- **Render bajo demanda:** las ocho escenas estáticas no consumen `requestAnimationFrame` de forma continua. Solo el Atlas se anima; el render se pausa cuando se cambia de pestaña o sale del viewport.
- **DPR adaptativo:** calidad del Canvas reducida suavemente en pantallas densas; menores capas generativas en pantallas angostas.
- **Funciones:** familias polinómica, sinusoidal, exponencial, logarítmica y racional, con fórmulas, derivadas analíticas, dominios y desafíos propios. Asíntotas y discontinuidades se separan en el dibujo.
- **Diseño:** controles segmentados, foco accesible, jerarquía editorial, detalles en tarjetas y marco del laboratorio, sin nuevas dependencias.
- **Verificación:** `npm test`, `tsc --project tsconfig.mathcheck.json`. El build de React requiere instalar las dependencias de `package.json`.

## V0.4 · Ejemplos reales y Atlas por separado (en PR de revisión)

El recorrido inicial abre **Funciones**, no una fusión de curvas. Desde **Atlas generativo** pueden seleccionarse individualmente Lissajous, Lorenz o Gielis. La animación está limitada a 20 FPS, y Lorenz se calcula sólo si se selecciona.

El capítulo **Integrales dobles** permite comparar **cilindro, esfera completa, hemisferio, paraboloide, cono y superficie cuadrática**. Cada caso incluye fórmula, dominio, gráfica, aproximación y valor exacto. El resto de los capítulos también incorpora ejemplos específicos de funciones, límites, derivadas, integrales, matrices, EDO y gradientes. Los detalles de las ecuaciones y limitaciones están en [`docs/ADVANCED_LAB.md`](docs/ADVANCED_LAB.md).

Comandos de validación:

```bash
npm test
npx tsc --project tsconfig.mathcheck.json
npm run build
```

La compilación React/Vite depende de instalar las dependencias de npm y aún no está validada en este entorno; verificar en Vercel antes del merge.

## Puente Matemática → Geoespacial (experimento 09, rama propuesta)

El capítulo **Terreno y relieve** relaciona derivadas parciales, gradiente, sumas de Riemann e integrales dobles con una superficie topográfica IRREGULAR **sintética**. Incluye tres paisajes, grilla 8–48 celdas por lado, cota de referencia, volumen por encima/debajo del plano, pendientes y un perfil que comparte la misma función z(x,y) con el mapa.

El objetivo es enseñar qué cambia cuando pasamos de superficies ideales a datos muestreados. **No carga datos de terreno reales ni calcula riesgos, obras o alertas.** La diferencia respecto de una grilla sintética de 120×120 representa discretización, no precisión del DEM.

Ver [docs/GEOSPATIAL_BRIDGE.md](docs/GEOSPATIAL_BRIDGE.md) para fórmulas, validaciones, límites científicos y el storyboard propuesto de la segunda ruta (proyecciones; ráster/vector/DEM; observación óptica y radar).

Para probar los algoritmos: `npm test` y `npx tsc --project tsconfig.mathcheck.json`. La rama no altera `main` ni configura un despliegue.

## V0.6 · Atlas Geoespacial Interactivo

**De los números al planeta:** dos rutas de aprendizaje en la misma aplicación. Continúan intactos los laboratorios de matemática; la nueva ruta Geoespacial tiene tres escenas independientes:

- **10 · Proyecciones:** esfera con graticula y Mercator / equidistante / equivalente, deformación local, fórmulas y factores de área.
- **11 · Ráster × vector:** terreno sintético como píxeles, detalle según resolución, capas de líneas ficticias y celdas NoData.
- **12 · Bandas y sensores:** reflectancias ópticas sintéticas, RGB/falso color, NDVI y NDWI de McFeeters.

**Límites:** no se utilizan mapas reales, imágenes satelitales, CRS nacionales ni DEM importados. Este prototipo es exclusivamente educativo; la respuesta matemática y los gráficos salen de funciones deterministas. Nunca utilizarlo para riesgo, alertas ni decisiones técnicas sin validación y datos adecuados.

**Investigación y trazabilidad:** [docs/GEOSPATIAL_EDUCATION_V06.md](docs/GEOSPATIAL_EDUCATION_V06.md) y [docs/GEOSPATIAL_BRIDGE.md](docs/GEOSPATIAL_BRIDGE.md).

**Calidad:** `npm test` (pruebas matemáticas y geoespaciales), `npm run build` (TypeScript + Vite) y preview PR en Vercel. Un check externo verde no sustituye pruebas manuales de interfaz.


## V0.7 · Curvas de nivel + terreno Three.js bajo demanda

El capítulo **09 · Terreno y relieve** ahora permite cambiar entre: (1) vista 2.5D original, (2) mapa de curvas de nivel con equidistancia variable y perfil sincronizado, y (3) malla 3D Three.js con órbita y zoom. Las tres representaciones provienen de **una misma función sintética de elevación**, con unidades de metros. La escena 3D se importa y ejecuta únicamente al seleccionarla, se dibuja bajo demanda y libera recursos WebGL al abandonarla; si falla el contexto gráfico se puede volver al Canvas original.

- `npm test` cubre intersección de curvas de nivel, geometría, orientación de triángulos, cálculo y módulos geoespaciales previos.
- `npm run build` controla tipos de TypeScript y genera un chunk separado para Three.js.
- [Investigación y decisiones de arquitectura](docs/TERRAIN_3D_RESEARCH_V07.md).

**No se cargan DEM reales ni hay CRS/datum geodésico:** las cotas y el mapa continúan siendo ejemplos educativos, no información topográfica de campo.


## V0.8 · Datos de terreno reales, satélites y radares

La segunda ruta geoespacial continúa con tres experimentos, junto a los 13 anteriores:

- **13 · DEM real / San Juan:** incluye una muestra verificada de 81 alturas reales SRTM v3 (nominal ~90 m) consultadas a OpenTopoData el 2026-11-08 UTC, empaquetada para funcionar sin conexión; ofrece actualización opcional desde la API. Visualiza muestras, curvas interpoladas, perfil, pendiente local y volumen respecto de una cota. Fuente **identificada** y estado de carga/error; sin datos falsos cuando la API no responde. **No es un GeoTIFF original ni un DEM completo descargado.**
- **14 · Satélites y órbitas:** Sentinel-2 (ESA), SAOCOM (CONAE) y un geoestacionario ideal. Comparador de altura, velocidad, período, horizonte y traza conceptual sobre la Tierra. **No muestra posiciones en vivo, no son efemérides.**
- **15 · Radares:** distingue reflectividad meteorológica (dBZ), velocidad Doppler (m/s) y SAR satelital (σ⁰ en dB). Los tres patrones visuales son **simulaciones** para enseñar física, nunca datos medidos.

Las fuentes, fórmulas, limitaciones y el plan de nueve niveles están documentados en [GEOSPATIAL_V08_SATELLITES_DEM_RADAR.md](docs/GEOSPATIAL_V08_SATELLITES_DEM_RADAR.md).

No se incorporaron librerías nuevas para estas tres escenas. Three.js sigue siendo optativo y exclusivo del laboratorio 09. La muestra real SRTM está disponible sin conexión. La API pública de OpenTopoData puede bloquear solicitudes desde el navegador (CORS) o limitar consultas: si falla una actualización opcional, Mathscape conserva la muestra verificada e informa el motivo. No sustituye mediciones con superficies sintéticas.


## V0.9 · Geodesia argentina, WGS84, UTM y Gauss-Krüger

**17 experiencias en total.** Nuevo capítulo geoespacial interactivo: un mismo punto visto en coordenadas geográficas (grados) y plano UTM (metros); comparación educativa con las 7 fajas Gauss-Krüger asociadas a POSGAR07. Ejemplos de San Juan, Córdoba y Buenos Aires verificados contra resultados PROJ, con meridianos centrales, falsos orígenes, códigos EPSG y distancias.

**Advertencia:** POSGAR07 es un marco geodésico nacional, no una proyección. El modo Gauss-Krüger aplica geometría WGS84 ilustrativa pero **no realiza una transformación WGS84 → POSGAR07 de datum/época**. No usar coordenadas de esta escena en trabajos topográficos, catastrales o de ingeniería.

Ver [fuentes IGN y pruebas de geodesia](docs/GEODESY_UTM_POSGAR_V09.md). El capítulo no agrega dependencias pesadas ni afecta el módulo opcional Three.js. Si Vercel limita nuevas publicaciones, el avance de GitHub y su despliegue deben verificarse por separado.

## V1.0 · Software y Producto

Mathscape ahora conecta Matemática, Geoespacial y Software/Producto en **19 experimentos**. Dos capítulos interactivos nuevos:

- **17 · Primero el problema:** elegir entre rutas, publicaciones y transferencias; entender necesidad, objetivo, recorrido y el efecto de cada etapa.
- **18 · ¿Qué sucede después del clic?:** recorrer seis capas de un sistema, observar HTTP, validación, reglas, datos y estados; comparar éxito, rechazo y reintento.

Los casos no reproducen arquitecturas internas de empresas ni APIs reales: las solicitudes, respuestas, códigos HTTP y escenarios son **modelos didácticos**. El experimento bancario ilustra idempotencia y confirma que `202 Accepted` no significa dinero liquidado.

La experiencia nueva no requiere librerías adicionales. Conserva las visualizaciones existentes y optimiza el contenido editorial de los capítulos 00, 09 y 13–15.

Fuentes, currículo (FaMAF UNC 2026 y CS2023), librerías evaluadas y ruta de evolución: [SOFTWARE_PRODUCT_CURRICULUM_V10.md](docs/SOFTWARE_PRODUCT_CURRICULUM_V10.md).

## V1.1 · JSON y contratos HTTP

**20 experiencias interactivas.** El capítulo 19 abre un editor JSON y permite preparar solicitudes de terreno, publicaciones y transferencias, observar sintaxis, estructura y reglas de negocio, y comparar respuestas 400, 422, 201 y 202.

El desafío consiste en provocar un rechazo y corregir la solicitud: un éxito nunca se confunde con un proceso pendiente. **No hay red, dinero ni backend real**: son ejemplos ilustrativos con validación en el navegador y pruebas de regresión.

Fuentes y criterios: [currículo Software y Producto](docs/SOFTWARE_PRODUCT_CURRICULUM_V10.md). No se añadieron dependencias.
