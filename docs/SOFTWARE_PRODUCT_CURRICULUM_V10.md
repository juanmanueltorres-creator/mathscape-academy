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
| 20 Dentro de una máquina | CPU, RAM, SSD, OS, firmware, DNS y respuesta web con fallos | **Implementado** |
| 21 Datos y consultas | Esquemas, restricciones, índices, SQL, transacciones | Planeado |
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

## Iteración V1.2 · Dentro de una máquina

**Pregunta inicial:** ¿qué necesita una computadora para convertir un clic en una respuesta?

### Experimentos implementados

1. **La máquina:** placa madre vectorial diseñada para la aplicación; seis componentes seleccionables: CPU, RAM, SSD, interfaz de red, placa madre y GPU opcional. Cada selección enseña función, ejemplo concreto y confusión frecuente.
2. **Encender:** cinco momentos conceptuales: firmware → cargador de arranque → kernel → servicios → aplicación. El orden preciso puede variar según el hardware y el sistema operativo.
3. **Conectarse:** siete momentos desde la dirección ingresada en el navegador hasta la representación de una página, distinguiendo claramente computadora local y servidor remoto. Tres escenarios: conexión normal, red desconectada y servidor no disponible.
4. **Microdesafío:** reconocer qué ejecuta instrucciones (CPU), dónde residen temporalmente datos activos (RAM) y dónde persisten archivos (SSD). No se marca completado si hay respuestas incorrectas.

### Decisiones de rigor

- El esquema de motherboard es un **dibujo original interactivo**, no una fotografía, plano eléctrico, lectura de CPU o captura de un equipo real.
- El modelo de cinco capas es **conceptual**, no una pila física rígida. Las redes cruzan dispositivos y sistemas; un servidor remoto es otra máquina.
- HTTPS sobre TCP suele usar TLS y TCP, mientras HTTP/3 usa QUIC; DNS puede resolverse desde caché. La simulación no captura paquetes reales.
- GPU dedicada, Docker, Kubernetes y servicios distribuidos no son requisitos universales para una aplicación web. Se estudian en capítulos posteriores si corresponde.
- Las fallas no pretenden reproducir exactamente los códigos o tiempos de una red real; demuestran el lugar y el efecto de una interrupción.

### Fuentes curriculares y de ingeniería

- [ACM / IEEE / AAAI CS2023 · áreas de conocimiento](https://csed.acm.org/knowledge-areas/): Architecture and Organization, Operating Systems, Networking and Communication, Systems Fundamentals y Human-Computer Interaction.
- [UBA Computación · Plan 2023](https://computacion.dc.uba.ar/plan-de-estudios-2023/): Sistemas Digitales y Arquitectura y Organización de Computadores.
- [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/): procesos, memoria, concurrencia y persistencia.
- [MDN · Cómo funciona la web](https://developer.mozilla.org/es/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works): DNS, HTTP, cliente/servidor, recursos.
- [ArchVisor](https://github.com/Omega-Mu-Gamma-Studio/ArchVisor) y [Inside the CPU](https://github.com/iamamits/Inside-the-CPU-Interactive-Computer-Architecture-Simulator): referencias de interacción; sin copiar elementos ni agregar dependencias.

### Continuidad

El capítulo 20 permite avanzar sin interrumpir los capítulos 00, 09, 13, 14 y 15. Próximo desarrollo: **21 · Datos y consultas** con esquemas, restricciones, SQL y transacciones a partir de un caso geoespacial concreto. Mantener una sola idea activa, el texto breve y la evidencia diferenciada de la simulación.
