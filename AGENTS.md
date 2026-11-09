# AGENTS.md — Mathscape Academy

> **Leer este archivo antes de inspeccionar, diseñar o escribir código.**
> Mathscape no es un dashboard genérico. Es un **laboratorio narrativo, artístico y científicamente riguroso** que conecta Matemática, Geoespacial y Software / Producto.

## 1. Documentación de autoridad (en este orden)

1. [Norte de producto](docs/PRODUCT_NORTH_STAR.md) — **por qué existe**, público, tres rutas, prioridades y qué preservar.
2. [Dirección creativa/editorial](docs/CREATIVE_EDITORIAL_DIRECTION.md) — **cómo se ve, suena y enseña**; ritmo, tipografía, texto, interacciones, colores y ejemplos.
3. [Decisiones registradas](docs/ARCHITECTURE_DECISIONS.md) — decisiones aceptadas, alternativas descartadas y restricciones.
4. [Flujo de trabajo](docs/AGENT_WORKFLOW.md) — inspección, implementación, pruebas, QA, PR, merge y publicación.
5. `src/content.ts` — **inventario vigente** de escenas (no inferirlo del README histórico).

Los archivos `docs/PLAN_CURRICULAR.md`, `docs/SOFTWARE_PRODUCT_CURRICULUM_V10.md` y el resto de `docs/*V*.md` conservan investigación y decisiones **históricas**. Algunas descripciones de “pendiente” ya fueron implementadas; comprobar siempre `main`.

## 2. Identidad no negociable

**Promesa:** volver comprensibles sistemas complejos mediante exploración visual, precisión conceptual y una narrativa editorial austera.

- **Matemática 00–09:** formas generativas, cálculo, matrices, modelos y terreno irregular.
- **Geoespacial 10–16:** cartografía, sensores, SRTM, órbitas, radar y geodesia.
- **Software 17–20:** problema humano, recorrido de producto, HTTP/JSON y hardware/SO/red.
- **Capítulos faro:** **00 y 09**. **13, 14 y 15** están bien encaminados y admiten pulido visual/pedagógico con especial cuidado del rigor.
- La estética inspira, pero **no tapa información, no inventa datos ni justifica dependencias costosas**.
- No duplicar textos ni escribir en la UI que el proyecto fue “adaptado”, “mejorado”, “generado” o condicionado por una conversación. Hablar directamente del fenómeno y su efecto.

**Regla de una escena:** pregunta → interacción causal → consecuencia observable → explicación breve → microdesafío/puente. Los datos observados, modelos sintéticos, ilustraciones y supuestos deben distinguirse.

## 2b. Guías puente en revisión (G1/G2)

La rama de revisión introduce dos guías independientes de los capítulos numéricos: `G1` muestra modelos deterministas de neurona, descenso y atención; `G2` compara historia técnica y vocabulario actual con fuentes. Consultar `docs/AI_MATH_AND_SOFTWARE_HISTORY_GUIDES.md` y preservar sus límites científicos/editoriales. **No cambia** la prioridad del QA de 20 ni la reserva de los capítulos 21 Datos y consultas / 22 Infraestructura. Código: `src/ai-math.ts`, `src/AIMathGuide.tsx`, `src/SoftwareHistoryGuide.tsx`, `src/guide-styles.css`; tests: `tests/ai-math.test.mjs`. Estos son cambios de rama, no necesariamente mergeados ni publicados.

## 3. Primera inspección obligatoria

Antes de editar: revisar rama, `main`, PRs abiertos y últimas CI; leer código y tests del capítulo objetivo; entender su comportamiento actual. **Preservar lo que funciona.** No refactorizar el proyecto completo como efecto secundario.

Mapa útil:
- Shell, navegación, estado: `src/main.tsx`.
- Currículo: `src/content.ts`.
- Cálculos/resultados: `src/math.ts`, `src/measure.ts` y modelos por tema.
- Canvas: `src/visuals.ts` y módulos `*-visual.ts`.
- Terreno 3D opcional: `src/TerrainThree.tsx`.
- Software y contratos: `src/software.ts`, `src/api-contract.ts`.
- Máquina interactiva: `src/hardware.ts`, `src/HardwareStage.tsx`.
- Estilos: `src/styles.css`. Pruebas: `tests/*.test.mjs`.

## 4. Límites técnicos

- React + TypeScript + Vite. Preferir Canvas/SVG/HTML y componentes pequeños. Three.js **solo** donde el 3D cambia la comprensión; mantener lazy loading.
- Evitar nuevos paquetes salvo beneficio educativo medible y licencia/mantenimiento justificados.
- Render estático bajo demanda, animaciones pausables, reducción de movimiento, UI responsiva, interacciones de teclado y estados semánticos.
- La misma función/modelo produce visualización y métricas. No representar como reales elevaciones inventadas, API de terceros, órbitas en vivo, radar operacional o arquitectura interna desconocida.
- Geodesia: **POSGAR07 no es una proyección**. Terrain sintético `09` no es SRTM real `13`. Distinguir radar meteorológico de SAR.
- Los ejercicios HTTP/transferencias son **simulaciones locales**; `202` no prueba liquidación.

## 5. Criterio de entrega

Trabajar en una rama; agregar/modificar pruebas; ejecutar **`npm test`** y **`npm run build`** (TypeScript + Vite); revisar cambios, PR y feedback; fusionar solo con CI de la **cabeza actual** aprobado. Confirmar CI de `main`. No declarar Vercel Ready, QA visual ni producción sin verificación independiente. Vercel Hobby puede bloquear builds por cuota; **no** interpretarlo como fallo de código ni disparar despliegues repetidos.

No editar otros repos, gastar dinero ni alterar infraestructura o protección por iniciativa propia. Documentar el cambio editorial y los motivos, las fuentes, los riesgos, resultados de pruebas, límites y próximo paso pequeño.

## 6. Norte inmediato

**Primero:** comprobar la versión desplegada y hacer QA visual especialmente en 00, 09, 13–15 y 20. **Luego:** refinar con intervenciones pequeñas y rigurosas, o evaluar **21 · Datos y consultas** (SQL, integridad y un caso territorial), sin convertirlo en un sistema enorme.

**Pregunta de control:** *¿Qué idea entiende mejor una persona que entra por primera vez, y cómo lo demuestran la interacción y las pruebas?*
