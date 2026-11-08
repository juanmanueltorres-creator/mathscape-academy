# Protocolo de trabajo para agentes — Mathscape Academy

Esta guía responde **cómo continuar mañana sin pedir al usuario que vuelva a explicar el proyecto**. Leer primero el archivo raíz `AGENTS.md` y los documentos rectores enlazados. Mantener autonomía **supervisada**, trazabilidad y mejoras terminadas.

## 0. Orientación en cinco minutos

| Necesidad | Archivo / directorio |
| --- | --- |
| ¿Para qué existe el producto? | `docs/PRODUCT_NORTH_STAR.md` |
| ¿Qué voz, composición y estética mantener? | `docs/CREATIVE_EDITORIAL_DIRECTION.md` |
| ¿Qué decisiones no conviene reabrir? | `docs/ARCHITECTURE_DECISIONS.md` |
| ¿Cuál es el mapa ACTUAL de escenas? | `src/content.ts` — `SceneId`, `lessons`, `defaults` |
| ¿Dónde está la navegación y estado React? | `src/main.tsx` |
| ¿Dónde se dibuja? | `src/visuals.ts` y módulos `*-visual.ts` |
| ¿De dónde salen los resultados? | `src/math.ts`, `src/measure.ts`, modelos especializados |
| ¿Terreno 3D? | `src/TerrainThree.tsx`, `src/terrain.ts`, docs V0.7 |
| ¿SRTM real muestreado? | `src/real-dem.ts`, `src/srtm-snapshot.ts`, docs V0.8 |
| ¿Software/HTTP? | `src/software.ts`, `src/software-measure.ts`, `src/api-contract.ts` |
| ¿Hardware y red? | `src/hardware.ts`, `src/HardwareStage.tsx` |
| ¿Diseño responsive? | `src/styles.css` |
| ¿Tests? | `tests/*.test.mjs` y CI de GitHub |
| ¿Fuentes curriculares históricas? | `docs/PLAN_CURRICULAR.md`, `docs/SOFTWARE_PRODUCT_CURRICULUM_V10.md`, archivos geoespaciales |

**No usar archivos históricos como prueba del estado vigente.** El README todavía contiene secciones de versiones antiguas; consultar `main` y código.

## 1. Antes de escribir código

1. Leer las cuatro referencias operativas: `AGENTS.md`, North Star, dirección editorial, decisiones.
2. Revisar estado actual de `main`, PRs abiertos, acciones recientes, dependencias, estructura de código y deploys si afecta publicación.
3. Abrir las implementaciones y pruebas del capítulo objetivo. Identificar qué ya funciona y **qué no conviene tocar**.
4. Expresar en una frase el **problema del estudiante** y el **comportamiento verificable** que se pretende añadir/mejorar.
5. Investigar fuentes primarias cuando haya conceptos científicos, fórmulas, reglas/estándares de software o datos. Separar datos confirmados, hipótesis e ilustraciones.
6. Examinar referencias externas (repositorios educativos, librerías, gráficos), pero **no copiar código ni imágenes** sin verificar licencia y atribución. Si el valor se obtiene con Canvas/SVG y React existentes, usar eso.
7. Elegir una **entrega pequeña, completa y reversible**. Evitar refactorizar la arquitectura entera como efecto colateral.

## 2. Patrón de implementación

- Rama de funcionalidad o corrección desde `main`; nunca editar código remoto a ciegas.
- Mantener funciones matemáticas y simuladores como **módulos puros testeables**. Los gráficos deben llamar al mismo modelo que el inspector.
- Diseñar estados de éxito, error, ausencia de datos, falta de red, acceso por teclado y móvil desde el principio.
- Agregar controles solo si su valor cambia un objeto, explicación o métrica. No crear sliders sin efecto.
- Para contenido, escribir **título, bajada, acción, efecto y límite** antes de añadir UI. Corregir redundancias.
- Preservar los capítulos 00 y 09 y el rigor de 13, 14, 15 y 16. No eliminar datos de fuente, CRS, fecha, unidad, descripción de método o advertencia necesaria.
- Mantener import dinámico en WebGL y escenas pesadas. Evitar animación continua si no hace falta.
- Cambiar accesibilidad y rendimiento junto con la interfaz, no al final.
- Documentar motivos y cualquier trade-off relevante **en el mismo PR**.

## 3. Pruebas y revisión

Comandos canónicos del repo, si las dependencias están instaladas:

```bash
npm install
npm test
npm run build
```

`npm test` usa Node con `--experimental-strip-types`; `npm run build` ejecuta `tsc --noEmit && vite build`. No declarar “build aprobado” porque los tests pasaron o porque GitHub mostró un commit: comprobar la fase exacta. Para código matemático, contrastar resultados con soluciones exactas o ejemplos numéricos; para software, probar estados, errores, invariantes y efectos secundarios.

**Checklist de QA manual con navegador (si está disponible):**
- Desktop ~1440 px, tablet ~768 px, móvil ~390 px; scroll, recorte, tipografía y botones.
- Tab, Enter/Espacio, foco visible, lectura de estados; reducción de movimiento.
- Escena 00: no congelar al cambiar, pausar fuera de vista, controlar densidad de canvas.
- Escena 09: 2.5D/curvas/3D comparten altura, cámara y controls funcionan.
- Escenas 13–15: las leyendas diferencian muestra real/modelo y unidades.
- Escenas 17–20: cambios por caso, validación, errores y selección sobre SVG funcionan.
- Console sin errores; ni assets ausentes ni loops de render involuntarios.
- Si se cambió el CSS global: probar al menos un capítulo de **cada** ruta.

## 4. Publicación y Git

1. Crear PR claro con contexto y capturas **solo si son reales**; indicar qué se preservó.
2. Esperar CI de **la cabeza actual** de la rama, corregir y volver a ejecutar. No confiar en CI de commits anteriores.
3. Resolver observaciones de revisión sin ocultarlas. Si la API, fuente o prueba está inaccesible, explicitar el bloqueo.
4. Merge con SHA esperado después de CI exitoso; confirmar que `main` recibió el commit y que **su propia CI** pasó.
5. Vercel puede fallar por cuota de builds del plan Hobby. Separar:
   - **Código probado:** tests y TypeScript/Vite completados.
   - **Deploy Ready:** Vercel construyó el commit pedido.
   - **QA visual:** se abrió la URL de esa versión y se probó el comportamiento.
   - **Producción:** el dominio de producción apunta al commit previsto.
6. No usar una preview vieja como prueba de la última versión. **No** modificar protección, gastar builds repetidos o hacer redeploys para ocultar un estado fallido.
7. Los cambios de infraestructura, credenciales, dominios, costos o acciones destructivas necesitan revisión explícita; jamás copiar tokens al repositorio.

## 5. Qué dejar al terminar cada iteración

En PR y/o documentos registrar:

- Qué problema de aprendizaje se resolvió y para quién.
- Qué capítulo y archivos cambiaron.
- Qué interacción nueva o precisión editorial existe.
- Qué modelo/fuente justifica el resultado y cuáles son sus límites.
- Tests agregados y resultado numérico; estado real de CI, Vercel, visual QA y producción.
- Decisiones aceptadas y alternativas descartadas.
- Deuda abierta (con prioridad) y el **próximo paso más pequeño**.

Actualizar `docs/ARCHITECTURE_DECISIONS.md` si se cambia una regla de fondo, `docs/PRODUCT_NORTH_STAR.md` si cambia el alcance, `docs/CREATIVE_EDITORIAL_DIRECTION.md` si cambia la identidad, y `AGENTS.md` si cambia el mapa de archivos o flujo de validación.

## 6. Autonomía acotada

El usuario autorizó investigar recursos y repos, iterar y mejorar Mathscape conservando su visión. Eso **no es licencia** para:
- Empezar otras apps o reformar su infraestructura.
- Forzar deploys, pagar nuevos servicios, eliminar información ni romper protecciones.
- Afirmar integración “completa” sin pruebas.
- Inventar hallazgos educativos o afirmar que las cifras simuladas son observaciones reales.
- Reescribir contenido por gusto sin una ventaja evidente en comprensión, usabilidad o rigor.

Cuando haya incertidumbre, realizar el máximo progreso seguro y documentar el límite. Si el siguiente paso afecta decisiones fundamentales o materiales, elevarlo en lugar de adivinar.

## 7. Primera tarea sugerida para el próximo agente

**No empezar automáticamente un capítulo nuevo.** Primero inspeccionar `main`, las acciones GitHub/Vercel y el laboratorio 20 en navegador; cerrar QA visual pendiente. Luego seleccionar **una** mejora concreta en 00, 09 o 13–15 (p.ej. un puente visual de fórmula→muestra) **o** diseñar el capítulo 21 de datos/consultas con un caso territorial simple.

Cada agente debería poder responder al finalizar: *¿qué entiende ahora mejor el visitante, cómo lo comprobamos y qué preservamos?*
