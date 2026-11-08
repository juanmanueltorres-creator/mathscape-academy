# Mathscape Academy V0.9 · Coordenadas, WGS84, UTM y POSGAR07

## Propósito educativo

El objetivo no es memorizar EPSG: enseñar **por qué un lugar puede tener coordenadas en grados, metros UTM y Gauss-Krüger, sin que esas parejas sean intercambiables**. Vincula el capítulo de proyecciones, el muestreo SRTM y las futuras capas SIG reales.

Puntos de ejemplo redondeados (no hitos geodésicos levantados en campo):
- San Juan · Precordillera: 31,4000° S, 69,1000° O
- Córdoba · ciudad: 31,4200° S, 64,1800° O
- Buenos Aires · ciudad: 34,6000° S, 58,3800° O

## Qué está implementado

- Mapa didáctico de meridianos/paralelos en grados y plano métrico local con escalas homogéneas E/N (no un mapa topográfico).
- Conversión directa WGS84 → UTM con expansión elipsoidal de Mercator Transversa, factor k₀=0,9996, meridianos centrales cada 6°, falso Este 500.000 m y falso Norte sur 10.000.000 m.
- Fajas Gauss-Krüger de Argentina, central cada 3° desde −72° hasta −54°, k₀=1, origen −90°, falso Este = faja × 1.000.000 + 500.000 m. Códigos EPSG 5343–5349 para POSGAR07 / Argentina 1–7.
- Distancia aproximada sobre esfera entre puntos separados 0,1° en latitud y longitud, demostrando por qué un grado no equivale siempre a la misma distancia en metros.
- Cambiar ciudad, proyección, latitud o longitud recalcula coordenadas y geometría ilustrativa. Ecuaciones accesibles en el inspector.
- Pruebas contra PROJ/pyproj de los ejemplos sin agregar dependencia en el navegador.

## Límite geodésico fundamental

**POSGAR07 es el marco de referencia geodésico nacional de Argentina** (IGN, adoptado en 2009), no una proyección. Las siete fajas de Gauss-Krüger son proyecciones cartográficas, por ejemplo EPSG:5344 para Argentina 2 y EPSG:5346 para Argentina 4.

El laboratorio aplica la geometría elipsoidal WGS84 con parámetros oficiales de las fajas, **pero no implementa la transformación de marco/época de WGS84 al marco POSGAR07**. Por eso ese modo se llama esquema GK ilustrativo. Aunque los números se aproximen a los oficiales, NO sirven para catastro, minería, obras, GNSS de precisión ni mensura. En la práctica se requiere una operación de coordenadas adecuada al lugar y época (PROJ/QGIS con metadatos/grillas), precisión esperada y control topográfico.

Fuentes:
- [IGN · POSGAR07](https://www.ign.gob.ar/NuestrasActividades/Geodesia/Posgar07)
- [IGN · Sistemas de proyección](https://www.ign.gob.ar/NuestrasActividades/ProduccionCartografica/sistemas-de-proyeccion)
- [IGN · Definición de proyecciones oficiales EPSG](https://ramsac.ign.gob.ar/posgar07_pg_web/documentos/Informe_sobre_codigos_oficiales_EPSG.pdf)
- [EPSG:5346 · POSGAR 2007 / Argentina 4](https://epsg.io/5346)
- [PROJ · Transverse Mercator](https://proj.org/en/stable/operations/projections/tmerc.html)

## Criterios de salida

1. San Juan WGS84 UTM zona 19S (EPSG:32719): referencia PROJ (E=490493,47 m; N=6526062,32 m).
2. Córdoba UTM 20S (EPSG:32720): referencia PROJ (E=387843,15 m; N=6523247,87 m).
3. Buenos Aires UTM 21S (EPSG:32721): referencia PROJ (E=373458,61 m; N=6170448,51 m).
4. Vista izquierda en grados, vista derecha en metros; no usar grados como metros para distancias.
5. Modo GK rotulado como ilustrativo sin cambio de marco geodésico.
6. Ejecutar npm test, npm run build, verificar despliegue y la experiencia interactiva; no declarar publicada una versión que Vercel haya bloqueado.

## Siguiente capítulo recomendado

**Dato satelital real y coordenadas**: utilizar un producto Sentinel-2 abierto con escena, fecha, resolución, bandas, máscara NoData/nubes y CRS explícitos. Así se demuestra por qué la georreferenciación y el píxel deben corresponder a la realidad que muestra la imagen. Luego SAR y radar meteorológico con sus fuentes oficiales, sin afirmaciones operativas de riesgo.
