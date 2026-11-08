# V0.7 · De la curva de nivel al relieve 3D

## Investigación técnica y necesidades educativas

**Problema didáctico identificado (hipótesis, no encuesta):** quienes comienzan con SIG suelen tratar como actividades distintas la lectura de curvas de nivel, el perfil longitudinal y un modelo de elevación en 3D. Si todas las representaciones comparten la **misma función de altura**, el estudiante puede reconocer sus equivalencias y sus errores de discretización. Este es el experimento actual, no un nuevo editor GIS.

| Tecnología estudiada | Fortalezas verificables | Decisión |
| --- | --- | --- |
| [Three.js](https://threejs.org/docs/) | Geometría real, iluminación, interacción orbital; permite renderizado bajo demanda y liberación explícita de GPU | **Incorporada solo en el laboratorio 09, cargada por import dinámico tras seleccionar Terreno 3D.** |
| [React Three Fiber](https://r3f.docs.pmnd.rs/advanced/scaling-performance) | Componentes React 3D, render bajo demanda | Evaluar si aparecen más escenas WebGL: para una escena simple se evita añadir una capa de abstracción adicional. |
| [d3-contour](https://d3js.org/d3-contour) | Isolíneas de grillas y generación robusta de polígonos | Referencia técnica; por ahora, algoritmo didáctico de triángulos de malla sin dependencia. |
| [Turf.js isolines](https://turfjs.org/docs/api/isolines) | Extrae isolíneas GeoJSON de puntos gridded | Candidato cuando se carguen datos de elevación reales. |
| [deck.gl TerrainLayer](https://deck.gl/docs/api-reference/geo-layers/terrain-layer) | Mallas y teselas en streaming con datos grandes | No agregar todavía: tamaño, fuentes y CRS exceden este módulo pequeño. |
| [CesiumJS](https://cesium.com/platform/cesiumjs/) | Globo geodésico y 3D Tiles | Reservar para coordenadas y órbitas reales, no para un terreno local inventado. |
| [QGIS Training Manual](https://docs.qgis.org/3.44/es/docs/training_manual/) | Análisis del terreno, curvas de nivel, perfiles, datos ráster | Referencia curricular y criterios de representación. |

## Laboratorio 09 · Tres vistas, un único modelo

1. **Relieve 2.5D**: se conserva el Canvas anterior.
2. **Curvas de nivel**: mapa plano con isolíneas, cota seleccionada, intervalo ajustable y perfil en la misma pantalla. Marching triangles: cada cuadrícula se triangula para evitar la ambigüedad de sillas del método de cuadrados. No es una implementación cartográfica de producción.
3. **Terreno 3D**: Three.js renderiza malla BufferGeometry indexada, iluminación, cámara orbital, plano de cota de referencia y punto muestreado. La geometría se genera desde `terrainMeshSamples()` con exactamente la misma `terrainElevation()` que alimenta volumen, perfil e isolíneas.

### Reglas de rendimiento

- Carga dinámica del componente WebGL. Nada de Three.js en las otras doce escenas.
- Sin bucle de animación: renderizar solo cuando cambian cámara, parámetros o tamaño. Densidad máxima de 48×48 celdas, pixel ratio máximo 1.5.
- Liberar geometrías, materiales, listeners, `ResizeObserver`, `OrbitControls` y renderer al cambiar de escena.
- WebGL no disponible → mensaje y retorno manual al Canvas existente.
- La malla y las isolíneas representan terreno **sintético**, en coordenadas locales y metros, NO un DEM georreferenciado.

### Cuidado científico

Las isolíneas se interpolan linealmente dentro de cada triángulo de una grilla y son aproximaciones de la superficie subyacente. La suavidad depende de n y del intervalo de altura. En 3D, x, y y altura conservan escala horizontal y vertical 1:1 al usar la misma conversión metros/unidad; no hay exageración vertical intencional. El plano semitransparente representa una cota de referencia, no el nivel real del mar. Los volúmenes corresponden a integrales de celdas, no mediciones de campo.

## Potenciales próximos experimentos

- Perfil topográfico trazado con lápiz sobre mapa y actualización sincronizada de las tres vistas.
- Extracción de un DEM pequeño autorizado (GeoTIFF con CRS y datum vertical, máscara NoData) y un vector GeoJSON; QGIS/GDAL como proceso de validación, no en el cliente al inicio.
- Un laboratorio **cuenca hidrográfica** que distinga flujo D8 aproximado, resolución, sumideros espurios y límites del método.
- Laboratorio de SAR: comparación con sensores ópticos, speckle, incidencia y deformación (sin simular observaciones reales).

Cualquier evolución debería mantener la regla: fuente identificable, precisión matemática, prueba de rendimiento y una pregunta educativa concreta.
