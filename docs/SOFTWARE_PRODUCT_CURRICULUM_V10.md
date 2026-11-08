# Mathscape V1.0 — La tercera ruta: Software y Producto

## Intención
Una acción cotidiana puede revelar un sistema entero. La persona primero entiende lo que quiere lograr; después descubre una solicitud, una regla, un dato, un fallo posible y una decisión. Mathscape no es un catálogo de herramientas ni una colección de infografías estáticas.

El capítulo 00 es el umbral visual (geometría generativa), el 09 une ecuaciones con terreno y los capítulos 13–15 diferencian elevaciones reales, órbitas modeladas y radares simulados.

Las infografías del usuario se usan como guías de jerarquía: necesidad, medida, recorrido y consecuencia. Los casos de rutas, publicación y banca se entienden de forma incremental; nunca se reproducen las infografías densas como pantalla.

## Currículo contrastado
- Plan FaMAF UNC 2026: Introducción a Algoritmos, Redes y Sistemas Distribuidos, Ingeniería del Software I y Bases de Datos, entre otras. https://famaf.unc.edu.ar/academica/grado/licenciatura-en-ciencias-de-la-computaci%C3%B3n/
- ACM/IEEE CS2023: Software Development Fundamentals, Software Engineering, HCI, Data Management, Networking, Security, Distributed Computing y Graphics. https://csed.acm.org/knowledge-areas/
- OSSU: modelo de progresión autodidacta, sin reproducir cursos ni afirmar equivalencia académica. https://github.com/ossu/computer-science

## Repos y componentes evaluados
- System Design Primer: piezas y decisiones de arquitectura; no se reutilizan diagramas. https://github.com/donnemartin/system-design-primer
- roadmap.sh: rutas y conceptos conectados; no se copia contenido. https://roadmap.sh/
- React Flow: nodos interactivos para un futuro editor de grafos, no necesario ahora. https://reactflow.dev/learn/customization/custom-nodes
- Mermaid: secuencias y errores, referencia para orden de mensajes, sin añadir runtime. https://mermaid.js.org/syntax/sequenceDiagram
- GeoRank (repo privado del ecosistema): patrón de fecha/fuente/limitación; no se integra como dependencia.

## Ruta de software
| Capítulo | Experimento | Estado |
|---|---|---|
| 17 Primero el problema | Rutas, publicaciones, transferencias: necesidad, efecto y métrica | Implementado |
| 18 ¿Qué sucede después del clic? | UI → HTTP → reglas → datos → respuesta; fallos y reintentos | Implementado |
| 19 JSON, POST y contratos | Editor JSON, solicitudes, sintaxis 400, reglas 422 y respuestas 201/202 | **Implementado** |
| 20 Datos y consultas | Esquemas, restricciones, índices, SQL, transacciones | Planeado |
| 21 Infraestructura | Servidor, CDN, contenedor, colas y réplicas | Planeado |
| 22 Escala y latencia | Latencia p95, carga, costo y fiabilidad | Planeado |
| 23 Diseño de sistemas | Elegir componentes con tradeoffs concretos | Planeado |
| 24 Casos propios | GeoPlatform, Opportunity OS y Question Radar con evidencias | Planeado |

## Reglas editoriales y científicas
- Una idea activa por pantalla; título corto, una frase de contexto, interacción y efecto.
- El recorrido de una funcionalidad debe conectar decisión de ingeniería con consecuencia visible al usuario.
- El usuario puede seleccionar caso, etapa y resultado; la información nueva aparece cuando la necesita.
- Ningún endpoint o estado de esta simulación representa APIs internas reales de Google, Meta o bancos.
- HTTP 202 significa solicitud aceptada para procesarse, no transferencia liquidada. La idempotencia real requiere reglas en el servidor; este laboratorio no mueve dinero.
- Estado inválido: no hay datos cambiados. Reintento de transferencia: mismo identificador, sin segundo débito.
- Cualquier cifra externa o referencia de producto debe distinguir evidencia de ejemplo.

## Calidad
- No sumar nuevas dependencias. Three.js sigue limitado a relieve 3D.
- Botones nativos y estados aria-pressed, diseño responsivo y lectura progresiva.
- Pruebas de casos válidos, invalidación, reintentos y semántica de HTTP.
- Compilar TypeScript y Vite; revisar preview, consola y diseño móvil antes de producción.

## Iteración V1.1 · Editor de contratos

**Un JSON no es un permiso para hacer cualquier cosa.** La persona prepara una solicitud, la edita, observa su validación y recibe una respuesta. La experiencia separa sintaxis, estructura y reglas de negocio; los errores aparecen donde ocurren.

**Tres casos representativos** (simulaciones locales, sin invocar endpoints):
- Terreno: POST /analisis/pendiente · bbox geográfico y EPSG:4326, resolución en metros. Un éxito 202 significa que el procesamiento podría continuar.
- Publicaciones: POST /publicaciones · título, tamaño de archivo y visibilidad. Respuesta 201 si se crea el recurso en el modelo.
- Transferencias: POST /transferencias · destino, monto en ARS y clave de idempotencia. Respuesta 202: solicitud aceptada, no liquidación; sin dinero real.

**Ejercicio:** enviar un caso incorrecto (400/422), leer la causa, reparar y obtener 201/202. Solo entonces se marca completo el capítulo.

**Estándares de referencia:**
- [MDN · códigos HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status): 201 creado, 202 aceptado, 400 sintaxis incorrecta, 422 contenido sintácticamente correcto pero inválido.
- [JSON Schema · required y additionalProperties](https://json-schema.org/understanding-json-schema/reference/object): inspiración para un contrato explícito; la implementación usa validadores TypeScript deliberadamente simples, no un motor general JSON Schema.

**Alcance:** las coordenadas, límites, saldos, rutas y respuestas son datos de ejemplo. El programa ejecuta JSON.parse y reglas locales, sin fetch, peticiones reales, procesamiento satelital ni transferencias bancarias.

**Comprobaciones:** pruebas de sintaxis, tipos, campos faltantes y extra, valores inválidos, EPSG, bbox, montos, tamaño y corrección. Sin dependencias nuevas.
