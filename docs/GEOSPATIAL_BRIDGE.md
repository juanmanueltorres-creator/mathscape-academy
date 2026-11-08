# Mathscape Academy → Atlas Geoespacial: puente V0.5

## Objetivo
Conectar el cálculo diferencial e integral con el análisis de un terreno irregular. **Esta iteración implementa solamente un laboratorio de relieve sintético**, no una herramienta SIG operativa. No genera ni ingiere DEM reales.

## Experimento 09: «Del cálculo al terreno irregular»

- Tres paisajes sintéticos deterministas: lomas y quebradas, valle de cauce curvo, ladera irregular.
- Superficie en perspectiva y perfil transversal a coordenada Y elegida. Todas las longitudes horizontales están en metros; las cotas también.
- Extensión de 1000 m × 1000 m, grilla n × n y método de puntos medios. Cambiar n modifica el muestreo, no el relieve subyacente.
- La función z(x,y) combina tendencia regional, gaussianas y ondulaciones. No intenta recrear procesos geológicos ni reproduce ninguna localidad real.
- La pendiente del punto se aproxima por diferencias centrales: ∂z/∂x ≈ [z(x+Δ,y)−z(x−Δ,y)]/(2Δ), con Δ=1000/n m. Se reportan |∇z|×100 (%) y θ=arctan|∇z| (°).
- Los volúmenes relativos a un plano z₀ se aproximan mediante Σ max(zᵢⱼ−z₀,0)Δ² (por encima) y Σ max(z₀−zᵢⱼ,0)Δ² (por debajo), en m³.
- Se presenta una comparación contra la misma función muestreada con 120×120 celdas: **diferencia por discretización**, no error geodésico, precisión instrumental ni incertidumbre del DEM.
- «Corte» y «relleno» son etiquetas educativas referidas a un plano horizontal; no son un cómputo de movimiento de suelos para obra.

## Conexión entre las dos rutas

| Matemática | Geoespacial | Experiencia |
|---|---|---|
| Funciones z(x,y) | Modelo digital de elevación | Combinar superficies suaves y rugosidad |
| Derivadas parciales, gradiente | Pendiente y orientación | Mover punto, medir cambio |
| Integral doble, suma de Riemann | Volúmenes de relieve | Cambiar cota de referencia y tamaño de celda |
| Discretización | Ráster y resolución | Comparar malla gruesa y fina |
| Matrices | Proyecciones y transformación de coordenadas | Propuesta posterior |
| Sensores ópticos y SAR | Comparación de observaciones | Propuesta posterior |

## Qué vendría después (no implementado)

1. **Globo, coordenadas y proyecciones:** distancias geodésicas vs planas, CRS y distorsión.
2. **Datos ráster, vector y terreno:** permitir cargar un recorte DEM autorizado y mostrar su metadato (fuente, resolución, fecha, datum vertical, CRS y nodata). No asumir que grados son metros.
3. **Observación terrestre:** interpretar una imagen óptica o radar real con sus bandas, geometría, unidades y limitaciones. No presentar un SAR como un radar meteorológico.

## Condiciones para trabajar con un DEM real

Validar derechos de uso, CRS proyectado apropiado para medir metros, datum vertical, unidades, tamaño de celda, NoData, resolución efectiva, incertidumbre y extensión. Separar DEM/DTM/DSM según el producto y su propósito. Los datos reales necesitan una ruta de importación, validación y procesamiento adicional; no reemplazar el modelo sintético sin esas comprobaciones.

## Referencias de conceptos (no avalan los paisajes sintéticos)

- [QGIS — Raster terrain analysis](https://docs.qgis.org/3.44/en/docs/user_manual/processing_algs/qgis/rasterterrainanalysis.html): algoritmos de pendiente, orientación y relieve.
- [USGS — DEM reference systems, vertical datum and resolution](https://www.usgs.gov/faqs/what-projection-horizontal-datum-vertical-datum-and-resolution-a-usgs-digital-elevation-model).
- [QGIS — Training Manual](https://docs.qgis.org/3.44/en/docs/training_manual/): ráster, vector y análisis.
- Atlas Geoespacial Interactivo: brief curricular compartido en esta conversación (ruta de 9 niveles, seleccionando solo el primer puente).

## Criterios de aceptación

- La pendiente de un plano sintético se obtiene correctamente con diferencias centrales.
- Una superficie constante de +100 m sobre el datum y 1 km² de área entrega 100 000 000 m³.
- Seleccionar otra coordenada cambia cota y pendiente sin alterar el volumen del área total.
- Las grillas no se recalculan por un loop de animación; la escena es estática salvo interacción.
- Nunca se afirma que un terreno sintético represente topografía real ni que el error de discretización sea incertidumbre.
