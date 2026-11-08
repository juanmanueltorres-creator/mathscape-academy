# Atlas Geoespacial — Investigación aplicada y V0.6

## De los números al planeta

La aplicación tiene dos rutas dentro de una sola interfaz React/TypeScript. Se conserva el laboratorio de matemática y se agregan tres experiencias introductorias de geoespacial. El laboratorio de terreno V0.5 funciona como puente. **No se afirma que estas escenas representen imágenes o mapas observados realmente**.

## Relevamiento de fuentes y necesidades (noviembre 2026)

Estas necesidades son inferencias a partir de las tareas que enseñan instituciones y proyectos abiertos; **no constituyen una encuesta ni validación de usuarios**:

| Necesidad de aprendizaje/trabajo | Evidencia contrastable | Decisión de diseño |
|---|---|---|
| Entender distorsión y selección de proyecciones | [Projection Explorer](https://github.com/bairdlangenbrunner/projection-explorer), [QGIS CRS](https://docs.qgis.org/3.44/en/docs/user_manual/working_with_projections/working_with_projections.html) | Graticula esférica vs. 3 proyecciones, factores de escala y de área, elipses conceptuales; no dibujar fronteras falsas |
| Entender ráster, vector, resolución y NoData | [QGIS Training Manual](https://docs.qgis.org/3.44/es/docs/training_manual/), [QGIS raster analysis](https://docs.qgis.org/3.44/en/docs/user_manual/processing_algs/qgis/rasteranalysis.html) | Malla DEM sintética, píxeles consultables, capas vectoriales ilustrativas, activar huecos de NoData |
| Relacionar bandas con índices y limitaciones de sensores | [USGS NDVI](https://www.usgs.gov/landsat-missions/landsat-normalized-difference-vegetation-index), [NASA ARSET fundamentals](https://www.earthdata.nasa.gov/learn/trainings/fundamentals-remote-sensing), [OpenSkyLab](https://openskylab.space/edu_satellites_interactive.html) | RGB ilustrativo, falso color NIR-R-G, NDVI y NDWI de McFeeters; parámetros de sequedad con firmas sintéticas |
| Mantener grafismo comprensible en web | [React Simple Maps](https://www.react-simple-maps.io/), [d3-geo-projection](https://github.com/d3/d3-geo-projection) | No introducir dependencias todavía: Canvas propio, 3 escenas aisladas y sin loops continuos |

## Unidad 10 · La Tierra no cabe en un mapa

- Globo ortográfico ilustrativo con retícula; sin fronteras costeras ni datos reales.
- Mapa de retícula en tres proyecciones de una esfera de radio R: cilíndrica equidistante x=Rλ,y=Rφ; Mercator x=Rλ,y=Rln(tan(π/4+φ/2)); cilíndrica equivalente x=Rλ,y=Rsenφ.
- Escalas locales respecto de la esfera (paralelo estándar en ecuador):
  - Equidistante: k_EO=secφ, k_NS=1; área=secφ.
  - Mercator: k_EO=k_NS=secφ; área=sec²φ.
  - Equivalente: k_EO=secφ, k_NS=cosφ; área=1.
- La elipse deformada muestra cualitativamente la distorsión de un círculo pequeño sobre la esfera; no sustituye una geodésica precisa ni una indicatriz calculada sobre elipsoide.
- No usa WGS84 ni POSGAR: extender con una biblioteca geodésica validada y metadatos antes de operar con datos reales.

## Unidad 11 · ¿De qué está hecho un mapa digital?

- Elevación sintética en un cuadrado LOCAL de 1000×1000 m, muestreada al centro de cada celda.
- Ráster de 8–48 celdas por lado. Consulta píxel/valor, resolución lineal, media y NoData.
- Dos líneas vectoriales son capas de enseñanza **independientes** (ruta y cauce ficticios), no geometrías derivadas del DEM ni georreferenciadas.
- NoData = ausencia de muestra; nunca reemplazarlo por 0 para calcular elevación media.
- Etapa de producción futura: GeoTIFF, GeoJSON, nodata mask, CRS y datum explícitos, reproyección y control de unidades.

## Unidad 12 · La Tierra tiene más de tres colores

- Tres materiales sintéticos: vegetación, suelo y agua, con reflectancias inventadas y mezcladas de modo reproducible.
- Combinaciones: color natural ilustrativo, falso color NIR-R-G, NDVI=(NIR-R)/(NIR+R), NDWI McFeeters=(G-NIR)/(G+NIR).
- NDWI tiene distintas definiciones; en esta escena **siempre** se explicita la fórmula de McFeeters para agua superficial, no el índice de humedad NIR-SWIR.
- La sequedad es un parámetro didáctico para explorar sensibilidad de un índice, **no** un modelo calibrado ni inferencia agrícola.
- No hay bandas Landsat verdaderas, máscara de nubes, corrección atmosférica, PSF, respuesta espectral ni precisión cuantificada.
- SAOCOM/SAR y radares meteorológicos serán capítulos distintos: no compararlos como sensores intercambiables.

## Conexión entre capítulos

`03 Derivada → 08 Gradiente → 09 Terreno → 11 Ráster`, `06 Matrices → 10 Proyecciones`, `04-05 Integrales → 09 Volumen`, `01 Funciones → 12 Índices`.

## Criterios de salida / QA

1. `npm test`: pruebas analíticas de distorsión a 60°, NoData, consulta de valores e índices espectrales.
2. `npm run build`: compilación completa TypeScript + React + Vite.
3. Preview en Vercel del commit de rama y revisión interactiva en navegador.
4. `main` y producción solo tras checks; no se declara validación visual si no se realizó.
5. No copiar código de otros proyectos; referencias de diseño y aprendizaje enlazadas para trazabilidad.

## Después de V0.6: investigación, no promesa de implementación

- Importación segura de DEM reales con metadatos y sistema de coordenadas proyectado.
- Casos contextualizados de Córdoba y San Juan **con fuentes y licencia verificadas**; distinguir dato real, inferencia y simulación.
- Tarea educativa sobre riesgo de inundación que separe amenaza, exposición y vulnerabilidad; nunca generar alertas reales.
- Diferenciar satélite óptico, SAR y radar meteorológico, y discutir límites de la observación.

**Prioridad:** enseñar interpretación fiable de datos en 3 escenas terminadas antes de expandir a 9 niveles geoespaciales.