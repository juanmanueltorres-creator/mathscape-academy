# Dos puentes didácticos: cálculo de IA e historia de software
**Fecha:** 2026-11-09 · **Estado:** implementados en rama de revisión, no publicados en producción.

## Decisión de alcance
La numeración curricular **00–20** permanece intacta. Se incorporan **G1** y **G2** como guías puente; **21 Datos y consultas** y **22 Infraestructura y despliegue** siguen reservados según el North Star. Las guías no crean una cuarta ruta, ni un modelo generativo operativo en el navegador.

## G1 · ¿Qué calcula una inteligencia artificial?
**Pregunta:** ¿Qué operaciones matemáticas hacen posible aprender y seleccionar información?

Tres escenas elegibles con SVG responsive, controles de valor y comprobación:
1. **Neurona:** `z=w₁x₁+w₂x₂+b`; `σ(z)=1/(1+exp(-z))`. Cambiar entradas, pesos y sesgo modifica z y la salida. Conecta funciones, exponenciales y matrices. No explicar una neurona como si fuera un LLM.
2. **Descenso de gradiente:** tres muestras sintéticas de `y=2x`; minimizar `L(w)=promedio[(wx-2x)²]` mediante `w ← w−ηL′(w)`. Comparar peso/curva/error después de un paso y diez pasos; derivada analítica en función pura. Conecta derivadas y EDO/discretización. No insinuar que es la pérdida ni el entrenamiento real de un LLM.
3. **Atención:** consulta `q=[cos(θ),sin(θ)]`, tres claves fijas 2D, scores `q·k/√2T`, pesos softmax normalizados, suma ponderada de valores. La temperatura **T es un control didáctico adicional**, no parte de la fórmula básica de Vaswani. Vectores sin semántica lingüística; no interpretar la altura de barras como 'pensamiento' ni atención como explicación causal de un modelo comercial.

Una comprobación por módulo; la guía completa se marca al verificar las tres. Sin llamadas de red y sin pesos entrenables persistentes.

### Precisión
La salida sigmoide de una neurona puede interpretarse como probabilidad **en ciertas formulaciones**; aquí es un número entre 0 y 1 sin calibración estadística. El optimizador usa una función convexa diminuta, no una red profunda. La atención es una cabeza de dimensión dos que ilustra productos escalares, normalización y combinación; no contiene capas de posición, embeddings entrenados ni autoregresión.

## G2 · La técnica cambia. Algunas preguntas permanecen.
**Pregunta:** ¿Es el cambio de nombre un cambio de mecanismo?

Cronología por comparación, nunca un glosario de marketing. Cada ficha responde:
- ¿Qué problema existía antes y cómo se resolvía?
- ¿Qué parte permanece? (principio, contrato, artefacto, control)
- ¿Qué cambia? (protocolo, agente probabilístico, integración, riesgos)
- ¿Qué podemos citar?

Comparaciones:
- Ingeniería de requisitos / SRS → desarrollo guiado por especificaciones: continuidad con artefactos de intención que ahora orientan agentes; no igualar 'spec' a cascada.
- Plugins y llamadas remotas → tool calling y MCP: la integración no nació ayer; MCP define interfaz estandarizada para asistentes.
- Recuperación documental → RAG: búsqueda + generación; evitar 'RAG = base de datos'.
- Scripts y CI/CD → agentes con herramientas: bucles que eligen acciones, bajo permisos y tests.
- README/CONTRIBUTING → AGENTS.md: convenciones para otro tipo de lector; no nuevo lenguaje de programación.
- Delegación/concurrencia → multiagentes: nueva naturaleza de incertidumbre y coordinación, no garantía de productividad.

**Semántica de clasificación**: «continuidad» = misma necesidad y buena parte de la solución; «extensión» = principio existente con mecanismo añadido; «mecanismo diferente» = diferencia operacional sustantiva. No reducir a «todo es lo mismo» ni afirmar que todo es radicalmente nuevo.

## Fuentes de referencia verificadas
- Rumelhart, Hinton, Williams, *Learning representations by back-propagating errors*, Nature 323 (1986): https://www.nature.com/articles/323533a0
- Vaswani et al., *Attention Is All You Need* (2017): https://arxiv.org/abs/1706.03762
- IEEE 830-1998 (sustituido): https://standards.ieee.org/ieee/830/1222/
- ISO/IEC/IEEE 29148:2018 (requisitos): https://www.iso.org/standard/72089.html
- Lewis et al., *Retrieval-Augmented Generation* (2020): https://arxiv.org/abs/2005.11401
- Yao et al., *ReAct* (2022): https://arxiv.org/abs/2210.03629
- Anthropic, presentación de MCP (2024): https://www.anthropic.com/news/model-context-protocol
- AGENTS.md: https://agents.md/
- GitHub Spec Kit: https://github.github.com/spec-kit/

## Dirección editorial
En la interfaz: una pregunta corta + una interacción causal + una diferencia contrastable. No publicar peticiones internas, listas de herramientas a modo de publicidad, ni promesas de empleo o de rendimiento de agentes. Las comparaciones deben describir cambios y límites; cualquier opinión sobre 'renombrado' se fundamenta y no se presenta como hecho universal.

## Implementación y QA pendiente
- Archivos: `src/ai-math.ts`, `src/AIMathGuide.tsx`, `src/SoftwareHistoryGuide.tsx`, `src/guide-styles.css`, `tests/ai-math.test.mjs`, integración en `src/main.tsx`, `src/content.ts`, `src/measure.ts`.
- Controlar tests `npm test` y compilación `npm run build` en CI; inspeccionar los modos G1/G2 en mobile 390px, tablet 768px y escritorio 1440px.
- Confirmar keyboard, foco visible, SVG legible, condiciones de microdesafíos y completitud. No afirmar QA visual hasta abrir una versión real.
- Los próximos capítulos numéricos siguen siendo 21 datos y 22 infraestructura; **no** añadir un capítulo 23 por inercia.
