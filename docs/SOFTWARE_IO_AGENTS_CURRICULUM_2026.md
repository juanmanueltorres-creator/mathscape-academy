# Propuesta curricular — I/O, cloud, modelos y agentes (2026-11-09)

**Estado: propuesta, NO implementada.** Complementa `AGENTS.md`, `docs/PRODUCT_NORTH_STAR.md` y `docs/CREATIVE_EDITORIAL_DIRECTION.md`. No reemplaza el QA pendiente ni el capítulo 21 de datos/consultas. El inventario vigente está en `src/content.ts`.

## Pregunta central
¿Qué cambia cuando un programa deja de recibir solo clics y empieza a interpretar instrucciones, consultar herramientas y ejecutar tareas supervisadas?

## Distinciones conceptuales obligatorias
- **I/O:** entrada/salida de datos entre programa y entorno (teclado, archivo, red, stdout, sensores); no equivale a IA.
- **Modelo:** sistema que produce predicciones o respuestas a partir de entradas; abierto/cerrado describe disponibilidad de pesos/código/licencia, no necesariamente precio.
- **Asistente:** interfaz de ayuda; **agente:** sistema que selecciona acciones y usa herramientas bajo un ciclo de ejecución y límites.
- **Herramienta:** capacidad invocable (API, terminal, buscador); **MCP:** protocolo de integración, no modelo ni proveedor cloud.
- **RAG:** recuperación de información para contextualizar respuestas; no garantiza exactitud.
- **Harness/runtime:** contexto, herramientas, estado, permisos, sandbox y observabilidad alrededor del modelo.
- **Cloud:** forma de provisionar cómputo/servicios; no es requisito para usar un agente ni sinónimo de servidor.
- **Codex / Grok / Claude Code / Gemini CLI / OpenHands / Aider:** distinguir productos, modelos subyacentes, licencias, modalidad local/remota, límites y costos verificables. No convertir el capítulo en ranking comercial.

## Mapa de capítulos candidatos (orden sujeto a revisión)
21. **Datos y consultas** (prioridad preexistente): tablas, filtros, integridad, consulta territorial, errores verificables.
22. **I/O — Del dispositivo al proceso:** seleccionar teclado/archivo/API, seguir bytes → buffer → proceso → salida; simular bloqueo, permisos y errores.
23. **Dónde corre el código:** proceso local, servidor, contenedor, máquina virtual, función cloud; elegir ubicación y simular latencia, indisponibilidad y costo conceptual.
24. **Antes y ahora:** editor, compilador, debugger, control de versiones, CI, revisión, copiloto, agente; comparar flujos sin caricaturizar la ingeniería anterior.
25. **Qué es un modelo:** contexto, tokens, inferencia, herramientas, costos y límites; separar modelos abiertos, API comercial y opciones gratuitas con cuotas variables.
26. **Anatomía del agente:** objetivo → contexto → elección de herramienta → resultado → evaluación → nueva acción; estados de permiso, fallo, alucinación y revisión humana.
27. **Ecosistema de agentes:** fichas comparables de Codex, Grok y opciones abiertas; fuentes fechadas, categorías consistentes y actualización editorial, no logos decorativos.
28. **Spec-driven development:** necesidad → spec → criterios de aceptación → plan → tareas → implementación → tests → revisión; permitir cambiar un requisito y observar qué pruebas deben cambiar.
29. **MCP y RAG:** contrastar consulta sin fuente, recuperación de documentos y llamada a herramienta; enseñar procedencia, permisos, prompt injection y datos no confiables.
30. **Orquestación:** un agente vs varios; dependencia de tareas, aislamiento, costo, colisiones y aprobación de PR. Más agentes no implica mejor resultado.

## Primera implementación recomendada, después del QA
**21 · Datos y consultas**, como ya establece el North Star. A continuación **22 · I/O**, una escena pequeña que conecte el JSON del 19, la máquina del 20 y el almacenamiento del 21. No integrar proveedores reales, llaves ni llamadas pagas.

### Storyboard de 22
**Pregunta:** «Un archivo entra al programa. ¿Qué pasa si no puede leerse?»
**Interacción:** elegir origen (teclado/archivo/API) y condición (válida, ausente, permiso denegado).
**Consecuencia:** SVG causal con estados; bytes/entrada, proceso y salida cambian desde un único modelo puro.
**Interpretación:** diferencia entre I/O, memoria, almacenamiento, protocolo y error.
**Desafío:** seleccionar qué capa explica cada fallo.
**Pruebas:** determinismo del modelo, estados correctos, teclado, mobile, reduced-motion, sin llamadas reales.

## Vocabulario transversal: viejo / nuevo / permanece
- Permanece: algoritmo, variable, proceso, función, API, interfaz, contrato, test, bug, latencia, seguridad, revisión, versionado.
- Se amplía: contexto, prompt, tokens, inferencia, tool calling, embeddings, RAG, evaluación, trazas, guardrails, sandbox, permisos, agentes, orquestación, spec, handoff.
- No son equivalentes: prompt ≠ especificación; respuesta ≠ ejecución; razonamiento reportado ≠ prueba; modelo abierto ≠ gratis; contenedor ≠ VM; nube ≠ IA; MCP ≠ RAG; prueba verde ≠ producto útil.

## Reglas de diseño y entrega
1. Una pregunta, una manipulación, una consecuencia observable, una explicación y un microdesafío.
2. SVG/HTML/Canvas y funciones puras; sin frameworks nuevos ni backend por defecto.
3. Ejemplos deterministas etiquetados como **simulación**. No presentar como tráfico, arquitectura interna o uso de tokens reales.
4. Fuentes primarias y fecha en comparativas de productos; precios y límites sujetos a cambios, no hardcodearlos.
5. Revisar main, PRs, CI y despliegue antes de editar; rama → tests → build → PR → CI actual → merge supervisado. No declarar producción sin comprobar.
6. Priorizar capítulos terminados sobre expansión masiva.

## Referencias primarias
- GitHub Spec Kit: https://github.github.com/spec-kit/
- GitHub Spec Kit Agentic SDD: https://github.com/github/spec-kit/blob/main/docs/reference/agentic-sdd.md
- Codex harness: https://developers.openai.com/blog/codex-as-a-platform
- OpenAI Symphony: https://openai.com/index/open-source-codex-orchestration-symphony/
- OpenAI Agents SDK cookbook: https://developers.openai.com/cookbook/examples/codex/codex_mcp_agents_sdk/building_consistent_workflows_codex_cli_agents_sdk

## Próxima acción
Verificar QA y despliegue de V1.2; implementar 21 de forma aislada y comprobable; luego desarrollar 22 según este storyboard. Los capítulos 23–30 son **backlog curricular**, no trabajo simultáneo.
