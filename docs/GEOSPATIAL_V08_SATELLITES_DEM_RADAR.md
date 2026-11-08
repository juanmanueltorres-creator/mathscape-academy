# Mathscape V0.8 · Del terreno a los satélites

## Estado del currículo geoespacial

La ruta nació de planes de estudio de Geografía, Geociencias, Ambiente y SIG. Su meta es explicar **conceptos y decisiones**, no crear otro visor profesional.

| Nivel | Tema | Estado en Mathscape |
|---|---|---|
| 1 | Tierra, mapas, distorsión y proyecciones | Laboratorio de proyecciones |
| 2 | Coordenadas, geodesia, WGS84, UTM y POSGAR07 | Introducción WGS84; geodesia y UTM **por implementar** |
| 3 | Ráster, vector, NoData, modelos digitales | Grillas sintéticas y **SRTM real muestreado**; no GeoTIFF |
| 4 | Cartografía temática y comunicación | **Pendiente**; mapas coropléticos, clasificación e incertidumbre |
| 5 | SIG, relieve y territorio | Terreno, pendientes, integrales, perfiles y Three.js |
| 6 | Satélites y teledetección | Bandas ópticas sintéticas + **órbitas idealizadas** Sentinel-2/SAOCOM/GEO |
| 7 | Radares y meteorología | **Comparador didáctico** de reflectividad, Doppler y SAR. No radar real |
| 8 | Ambiente y comunidades | **Pendiente**; amenaza vs exposición vs vulnerabilidad, fuentes/alertas oficiales |
| 9 | Futuro de observación terrestre | **Pendiente**; constelaciones, InSAR, hiperespectral y GeoAI |

No confundir nivel incorporado con materia dominada ni con datos operativos.

## Muestras de relieve de San Juan: datos REALES, no GeoTIFF

La vista "DEM real · San Juan" llama a:

- **Servicio:** [OpenTopoData](https://www.opentopodata.org/), endpoint [srtm90m](https://www.opentopodata.org/datasets/srtm/).
- **Conjunto:** SRTM versión 3, producto nominal 3 arc-seconds ≈90 m.
- **Huella geográfica:** centro lat = −31.4000°, lon = −69.1000°; recorte de ±0.004° en latitud y ±0.005° en longitud. Zona precordillerana de San Juan.
- **Disponibilidad V0.8.1:** se guardaron los 81 valores reales devueltos el 2026-11-08 UTC en `src/srtm-snapshot.ts`. Esa instantánea verificada se carga localmente de manera predeterminada, porque el navegador público mostró errores de acceso de red/CORS aunque la API respondía por acceso directo. El usuario puede intentar una actualización voluntaria; si falla, se conservan los valores verificados.
- **Representación:** 81 posiciones solicitadas (malla 9×9) con interpolación bilineal declarada por la API. La **separación de muestras** es de aprox. 111 m N–S y 119 m E–O; **no equivale a la resolución nativa** del SRTM.
- **Referencia horizontal:** geográficas EPSG:4326, WGS84. **Referencia vertical:** EGM96, unidades metros. Referencia: [USGS SRTM product specification](https://www.usgs.gov/centers/eros/science/usgs-eros-archive-digital-elevation-shuttle-radar-topography-mission-srtm).
- **Vista:** puntos y curvas interpoladas sobre la grilla; perfil formado por valores devueltos; pendientes aproximadas por diferencias finitas y distancias locales equirectangulares, nunca por grados crudos.
- **Volumen:** integración de alturas medias de celdas respecto de un plano de referencia arbitrario. **Es una aproximación didáctica**, no cubicación geotécnica, movimiento de tierras o incertidumbre del SRTM.
- **Validación:** se verifican dataset, coordenadas, cardinalidad de respuesta, finitud de alturas y NoData; ninguna lectura inválida se reemplaza con altitudes inventadas.
- **Limitación operacional:** la API pública limita consultas (máximo 100 puntos/solicitud, 1 consulta/s). Mathscape guarda las 81 alturas reales en el código y puede mostrar el mapa sin solicitudes externas. El botón de actualización intenta consultar 81 puntos de una vez; si falla por CORS, cuota o red, conserva el recorte verificado y muestra el fallo. No se genera ningún DEM ficticio como sustituto. No guarda secretos ni solicita credenciales.
- **Fundamental:** el navegador NO descarga ni lee un GeoTIFF nativo. Este es un **muestreo auténtico de un DEM**; un cargador geoespacial validado será otra iteración.

### Qué exigir para pasar a un DEM georreferenciado profesional

GeoTIFF/COG con metadatos, CRS y transformaciones correctas, geoid vertical, NoData, licencia, resolución original, incertidumbre, fecha del producto, límites de cobertura, calidad e interpolación. Para operación, usar Rasterio/GDAL en preprocesamiento o geotiff.js para lectura acotada, y validar contra QGIS.

## Órbitas de satélites (escena 14)

- Física newtoniana del problema de dos cuerpos: μ = 398600.4418 km³/s², radio terrestre ecuatorial 6378.137 km, período sidéreo 86164.0905 s.
- Período orbital T=2π√(a³/μ), rapidez v=√(μ/a) y horizonte teórico α=acos(R/a).
- [Sentinel-2, ESA](https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/Facts_and_figures): órbita heliosincrónica de 786 km, MSI óptico con 13 bandas. Revisita nominal de 5 días para dos satélites; puede cambiar según configuración real.
- [SAOCOM, CONAE](https://www.argentina.gob.ar/ciencia/conae/misiones-espaciales/saocom/caracteristicas-tecnicas): SAR banda L, altura 620 km, 10–100 m de resolución según modo y 20–350 km de franja; período de repetición orbital 8 días en la pareja 1A+1B. Inclinación de **98° ilustrativa**, no efeméride de la constelación.
- [GEO, NASA](https://science.nasa.gov/earth/earth-observatory/catalog-of-earth-satellite-orbits/): órbita ecuatorial circular cuyo período iguala la rotación sidérea, altura ~35 786 km.

**Advertencia:** no hay TLE reales ni posición en vivo; no se incluye J2, arrastre, mantenimiento de órbita, precesión heliosincrónica ni hora de pasada real. La línea del globo es una ilustración **no a escala**; el mapa longitudinal/latitudinal muestra una trayectoria de modelo. El horizonte geométrico no es la huella del sensor y revisita ≠ período orbital.

## Radares: tres instrumentos, tres mediciones (escena 15)

- Radar meteorológico de reflectividad: dBZ=10 log10(Z/Z_ref), ecos atmosféricos; un valor dBZ no corresponde directamente a precipitación acumulada. [NOAA](https://www.noaa.gov/jetstream/reflectivity).
- Radar meteorológico Doppler: v_r=v·cos(α_mov−α_haz), dirección positiva si se aleja del radar. Solo componente radial; ángulos de dirección medidos como azimut desde el norte en sentido horario. [NOAA](https://www.noaa.gov/jetstream/velocity).
- Radar SAR satelital: retrodispersión de superficie σ⁰_dB=10 log10 σ⁰, dependiente de incidencia, polarización y rugosidad. [CONAE](https://www.argentina.gob.ar/ciencia/conae/misiones-espaciales/saocom/caracteristicas-tecnicas).
- Contexto argentino de radar meteorológico: [SINARAME, sistema de Radares Meteorológicos Argentinos](https://www.argentina.gob.ar/obras-publicas/recursos-hidricos/sistema-nacional-de-radares-meteorologicos-sinarame).

**Las tres imágenes de radar son simuladas** para enseñar la física y las unidades; no son mediciones del SMN, RMA, GOES o SAOCOM y no sirven para emitir avisos.

## Próximos pasos priorizados (no implementados)

1. **Geodesia y referencia territorial:** WGS84 ↔ UTM ↔ POSGAR07; distancia geodésica vs proyección local; distorsión cartográfica en Argentina.
2. **Satélite óptico vs SAR con producto real abierto:** consulta STAC, bandas, timestamps, resolución, máscaras y metadatos, mostrando límites de uso.
3. **Radar meteorológico real de SMN**: enlace contextual a fuentes oficiales; visualizaciones con fecha/hora, advertencia de desfase, sin alertas propias.
4. **Territorio y comunidad:** caso de cuenca o ladera de Córdoba/San Juan, relaciones entre pendiente, lluvia, ocupación y decisiones, diferenciando amenaza, exposición y vulnerabilidad.
5. **Constelaciones, InSAR, hiperespectral e IA espacial:** explicar señales y ambigüedades antes de agregar análisis automatizado.

### Reglas de continuidad

- Una experiencia terminada, medible y con caso práctico antes de abrir la siguiente.
- Nunca presentar simulaciones como datos observados ni algoritmos educativos como herramientas de riesgo.
- Evitar bibliotecas grandes salvo que resuelvan una necesidad; Three.js sigue cargándose solo en su escena 3D.
- Para cada módulo: referencias primarias, prueba numérica, build, preview y revisión del comportamiento público.
