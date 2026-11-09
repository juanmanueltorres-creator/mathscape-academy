# Propuesta curricular — I/O, Cloud y agentes de software
**Fecha:** 2026-11-09  
**Estado:** propuesta de investigación; no representa capítulos implementados.

## Alcance y precedencia
Mathscape conserva tres rutas. Esta expansión pertenece a Software/Producto y respeta AGENTS.md, PRODUCT_NORTH_STAR.md, CREATIVE_EDITORIAL_DIRECTION.md, ARCHITECTURE_DECISIONS.md y AGENT_WORKFLOW.md. **No desplazar la prioridad de QA visual y validación del capítulo 20 ni la entrega pequeña de 21 Datos y consultas.** El North Star prevé 22 Infraestructura y despliegue; mantener esa numeración, e incorporar I/O como puente conceptual dentro de 20/21 o en una escena posterior si el aprendizaje lo justifica. La numeración siguiente es tentativa.

## Mapa conceptual: distinguir las capas
- **I/O:** entrada/salida de datos entre procesos, dispositivos, archivos, red y usuario; stdin/stdout, buffers, streams, lectura/escritura, bloqueo y asincronía. No confundir I/O con UI.
- **Hardware y SO:** CPU, RAM, SSD, kernel, procesos, permisos.
- **Protocolos:** HTTP, TCP/QUIC, DNS; reglas de comunicación, no servicios cloud.
- **Datos:** JSON, SQL, esquema, persistencia, integridad.
- **Infraestructura:** servidor, VM, contenedor, nube, región, CDN, escalado; Kubernetes es opcional.
- **Modelo:** pesos y arquitectura de inferencia; un modelo por sí solo no tiene acceso a herramientas.
- **Proveedor y acceso:** API, modelo alojado, local, pesos abiertos, licencia, tarifa y límites. Gratuito, open source y open-weight NO son sinónimos.
- **Agente:** modelo + instrucciones + estado/contexto + herramientas + bucle de decisión/ejecución + permisos + verificación. Un chatbot sin herramientas no es equivalente a un agente de programación.
- **Orquestación:** subagentes, aislamiento, worktrees, colas, reintentos, revisión humana.
- **Proceso:** requisitos, especificación, diseño, tareas, pruebas, CI/CD, revisión, despliegue, observabilidad.

## Antes y ahora: comparador didáctico
1. Desarrollo clásico: requerimientos → diseño → código humano → tests → revisión → despliegue.
2. IDE y automatización: autocompletado, linters, CI/CD, infraestructura como código.
3. Asistencia generativa: prompt y sugerencias, con revisión humana.
4. Agentes con herramientas: leer repo → planificar → editar → ejecutar tests → corregir → PR.
5. Spec-driven: necesidad → especificación verificable → plan → tareas → implementación → convergencia; no implica que el agente sea autónomo ni que la especificación sea infalible.

**Vocabulario persistente:** requisito, interfaz, API, estado, contexto, proceso, dependencia, prueba, error, versión, contrato, despliegue.  
**Términos nuevos o recontextualizados:** token, ventana de contexto, tool calling, MCP, harness, skills, AGENTS.md, agent loop, worktree, guardrails, evals, spec-driven, prompt injection, observabilidad de agentes. Indicar qué conceptos son nuevos y cuáles existían antes con otro uso.

## Experimentos candidatos (NO implementar en bloque)
- **21 Datos y consultas:** según norte vigente; registros territoriales, filtro y restricciones.
- **22 Infraestructura y despliegue:** según norte vigente; variar latencia, falla, carga y cache; distinguir nube de contenedor.
- **23 I/O visible:** teclado/archivo/API → buffer → proceso → almacenamiento → pantalla; elegir I/O síncrono o asíncrono y observar esperas; conectar 19/20/21.
- **24 ¿Quién escribe el software?:** mismo bug con flujo tradicional, asistido y agente; comparar acciones, verificaciones y errores, sin prometer productividad universal.
- **25 Modelo, producto o agente:** clasificador interactivo con Codex, Grok, Gemini CLI, Claude Code, OpenCode, Cline, Aider y modelos locales; distinguir herramientas de modelos y políticas de licencia/precio con fecha de consulta. No construir ranking comercial permanente.
- **26 El bucle del agente:** simulador determinista de lectura, planificación, herramientas, ejecución, permisos, fallo, tests y revisión; no ejecutar código arbitrario ni usar APIs pagas.
- **27 De la idea al contrato:** ejercicio de spec-driven con requisito ambiguo → criterios de aceptación → tareas → pruebas → implementación conceptual. Mostrar también costo de especificar en exceso.
- **28 Varios agentes, un repositorio:** worktrees, concurrencia, conflictos, permisos y revisión; comparar ejecución secuencial/paralela.

## Primera escena de agentes (storyboard)
**Pregunta:** «¿Un modelo puede arreglar un bug solo?»  
**Interacción:** seleccionar modo chat / asistente IDE / agente con herramientas; activar o negar permisos; introducir test fallido.  
**Consecuencia:** grafo de estados cambia; solo el agente autorizado puede leer archivos, proponer patch y ejecutar test simulado.  
**Explicación:** el modelo propone; el entorno ejecuta; los permisos limitan; la prueba verifica parcialmente; la persona decide el merge.  
**Microdesafío:** detectar una instrucción maliciosa en un archivo leído y rechazarla.  
**Límite:** simulación local determinista, sin llamadas reales a modelos, sin acceso a repositorios del visitante.

## Fuentes primarias para investigación y contraste
- GitHub Spec Kit: https://github.github.com/spec-kit/ (Specify → Plan → Tasks → Implement → Converge).
- GitHub introducción: https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/
- OpenAI Symphony: https://openai.com/index/open-source-codex-orchestration-symphony/ (SPEC.md, WORKFLOW.md, agente y workspaces).
- AGENTS.md: https://agents.md/
- OpenCode: https://github.com/anomalyco/opencode
- Cline: https://github.com/cline/cline
- Aider: https://github.com/Aider-AI/aider
- Model Context Protocol: https://modelcontextprotocol.io/
Consultar documentación oficial de cada proveedor antes de fijar modelos, precios, planes, disponibilidad o capacidades. Etiquetar la fecha y separar licencia del cliente de licencia de los pesos del modelo.

## Secuencia de entrega y validación
1. Verificar PRs, CI, Vercel y QA visual de 20 (pendiente en docs rectores).
2. Terminar 21 según plan existente, con tests.
3. Diseñar un único experimento 22; validar comprensión antes de ampliar.
4. Prototipar 23 I/O con funciones puras y SVG, sin nuevas dependencias.
5. Agregar comparadores y agentes solo tras QA de los capítulos anteriores.
6. Para cada cambio: rama → tests npm test → build npm run build → PR → CI → revisión → merge autorizado → verificar deploy por separado.

**Decisión editorial:** no crear una ruta IA separada, no instalar agentes reales en el navegador, no convertir el capítulo en un catálogo de logos, no presentar una simulación como benchmark.
