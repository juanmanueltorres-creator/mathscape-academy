# G5 · Del registro al indicador — datos y estadísticas públicas

**Incorporación propuesta:** 2026-11-21  
**Ubicación:** Mathscape → Software y Producto, después de G4 «Del sensor al servicio industrial». No ocupa el capítulo 21 reservado a datos/SQL, ni altera capítulos matemáticos o geoespaciales. Sin nuevos servicios, cuentas, API ni fuentes automáticas.

## Pregunta

¿Cómo pasan los registros de sensores, operaciones, empresas, plataformas y encuestas a ser indicadores utilizados en decisiones industriales, comerciales y públicas?

> La lección enseña a **interrogar el dato, su procedencia y el cálculo**, no a apoyar u objetar una posición política. Los cuatro experimentos contienen **únicamente números inventados para enseñanza**.

### Capas de observación

Operacional → empresarial → sectorial/estadística pública → plataformas digitales (como otro origen de datos, no como un nivel necesariamente superior).

Cada capa requiere definir: unidad de observación; universo y muestra; período; magnitud y unidad; método de adquisición; variables faltantes; transformaciones; responsables y límites de la interpretación.

## Cuatro experimentos interactivos

1. **Calidad:** media de 10, 12, faltante, 16, 20. Comparar ignorar falta (14,50), error de reemplazar por cero (11,60) y registro duplicado.
2. **Representatividad:** población hipotética 70/30 con tasas de respuesta 20/70. Controlar proporción del grupo B en la muestra para ver sesgo. **No es una encuesta del INDEC**.
3. **Índice de precios:** variaciones imaginarias por rubro +10%, +30%, +5%; modificar el peso hipotético de vivienda y observar promedio ponderado. **No es la fórmula completa del IPC argentino, ni reproduce series oficiales**: el propósito es estudiar sensibilidad a ponderaciones y que el índice no equivale al precio de un producto individual.
4. **Salario real:** fórmula `(1 + variación nominal)/(1 + variación de precios) − 1`, porcentajes en el mismo período. Distinguir salario nominal de poder adquisitivo en modelo simplificado; el índice salarial publicado tampoco equivale a un sueldo particular.

## Cuatro fichas de indicadores públicos

| Indicador | Pregunta metodológica | Documentación primaria |
| --- | --- | --- |
| IPC | ¿Qué canasta, precios, ponderaciones, región, base y período? | [INDEC · Precios al consumidor](https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31-0) |
| Índice de salarios | ¿Qué sectores, tipos de remuneración y período? ¿Cómo se deflacta? | [INDEC · Índice de salarios (septiembre 2026)](https://www.indec.gob.ar/uploads/informesdeprensa/salarios_11_2682D43EDD23.pdf) |
| Pobreza por ingresos | ¿Se cuentan hogares o personas? ¿Qué líneas de ingreso, EPH y CBT? | [INDEC · Metodología de pobreza](https://www.indec.gob.ar/ftp/cuadros/sociedad/EPH_metodologia_22_pobreza.pdf) |
| Desocupación | ¿Se divide por población total o población económicamente activa? | [INDEC · Mercado de trabajo](https://www.indec.gob.ar/Nivel4/Tema/4/31/58) |

### Contexto de ponderaciones (fuera de la simulación)

Los documentos metodológicos del IPC nacional describen ponderaciones apoyadas en ENGHo 2004/05; existen datos posteriores de ENGHo 2017/18. **Una ponderación antigua es una cuestión relevante de método, no prueba automática de intención de falsificar.** Este módulo no publica tasas oficiales actuales ni atribuye motivaciones a políticos, técnicos o instituciones. Para auditar resultados reales habría que reconstruir todos los niveles de índices, canastas, regiones, revisiones y series con datos oficiales.

Fuentes:
- [INDEC · Nota metodológica IPC 2017](https://www.indec.gob.ar/uploads/informesdeprensa/ipc_06_17.pdf)
- [INDEC · Bases de datos de encuestas](https://www.indec.gob.ar/indec/web/Institucional-Indec-BasesDeDatos-1)

## Transparencia / límites

- Ingreso/salario, aumento de precios, empleabilidad y pobreza **son indicadores distintos**. No inferir mejora del bienestar a partir de una sola serie.
- Una cifra publicada puede ser correcta según su definición, pero resultar inadecuada para responder otra pregunta.
- Correlación ≠ causalidad; desactualización de pesos ≠ manipulación intencional; discrepancia de metodologías ≠ evidencia concluyente de fraude.
- En plataformas, usuarios observados ≠ muestra representativa de población. Vigencia, permiso, privacidad y sesgos deben considerarse.
- Nunca poner datos ilustrativos junto a «INDEC» sin la etiqueta clara «modelo hipotético».
- No se conectan cuentas personales ni se recogen datos de visitantes.

## Implementación

- `src/data-indicators.ts`: modelos deterministas sin APIs externas.
- `src/DataIndicatorsGuide.tsx`: navegación por 4 experimentos, controles y fichas con enlaces oficiales.
- `src/data-indicators.css`: diseño independiente responsive.
- `src/content.ts`, `src/main.tsx`, `src/measure.ts`: integración como escena G5 independiente.
- `tests/data-indicators.test.mjs`: pruebas numéricas, representatividad, calidad y enlaces.

## Validación antes de integrar

- `npm test` y `npm run build` en CI, sin alterar ejercicios anteriores.
- Navegación móvil, tabulador/teclado, estados de selección, enlaces externos y advertencias didácticas.
- Mantener Mathscape como **laboratorio de aprendizaje**. Cualquier auditoría política con datos reales es un análisis aparte con fuentes, versión y cálculos reproducibles: no publicar gráficos políticos de cifras inventadas.
