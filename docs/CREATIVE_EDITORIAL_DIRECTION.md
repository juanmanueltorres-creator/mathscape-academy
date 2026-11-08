# Mathscape — Dirección artística, editorial y educativa

**Documento operativo para diseño, contenidos e implementación.** Complementa `PRODUCT_NORTH_STAR.md` y `AGENTS.md`.

## 1. Idea estética: un atlas de relaciones

Mathscape no debe parecer un LMS corporativo, un dashboard de analítica ni una galería de tarjetas generadas por IA. Su identidad es un **estudio interactivo de ciencia, forma, territorio y software**. Precisión de un instrumento, asombro de una instalación digital, claridad de un buen libro de divulgación.

**Tensión intencional:** superficie visual expresiva / lenguaje verbal sobrio; complejidad científica / recorrido comprensible; arte generativo / datos fieles; juego / pruebas reales.

El usuario no necesita leer todo para comenzar. La primera interacción debe enseñar más que el primer párrafo.

## 2. Referencias aportadas y decisiones

El corpus de infografías del proyecto incluye: “Primero el producto. Después la tecnología”; “De la idea del producto a la implementación”; Google Maps y banca digital; publicaciones/Instagram; arquitectura por capas y escala (incluido Mercado Libre); ecosistema tecnológico y alternativas; productos propios; hardware → sistemas operativos → servicios → aplicaciones.

**Se rescata:**
- Títulos editoriales que enuncian una cuestión real.
- Secuencias numeradas y relaciones causales: **acción → mecanismo → consecuencia**.
- Comparación de escenarios de producto con mismos fundamentos y distintas prioridades.
- Categorías diferenciadas: hardware, sistema operativo, protocolos, servicios, datos, infraestructura y aplicación.
- Una idea principal que cierre la exploración; escalabilidad y complejidad subordinadas al problema.

**Se evita copiar literalmente:**
- Afiche en 16 columnas, mucho texto, iconos decorativos o logos de proveedores sin función.
- Atribuciones internas de arquitectura sin verificación pública.
- Un muro de servicios que confunde proveedor cloud, contenedor, orquestador y plataforma de datos.
- Duplicar una misma explicación en intro, panel, pie y desafío.
- Reemplazar la interacción por una imagen generada: **la infografía inspira el comportamiento, no es el comportamiento**.

La ilustración de pila tecnológica proporcionada fue una **referencia**. La respuesta correcta fue construir el capítulo 20 con máquina SVG seleccionable, arranque y recorrido web: no producir imágenes sueltas.

## 3. Sistemas visuales

### Composición

1. **Una protagonista:** gráfica, superficie, órbita, trazado, máquina, diagrama o editor. Debe atraer primero la vista.
2. **Una pregunta/título:** corto, con una palabra o concepto dominante. Una frase secundaria que sitúe, no recite instrucciones.
3. **Un área de control:** opciones editables relevantes al modelo actual. Evitar mostrar diez sliders a la vez; preferir controles contextuales.
4. **Un área de interpretación:** relación cuantitativa, fuente, unidad, explicación o trade-off visible, ligada a lo que cambió.
5. **Una acción de cierre:** microdesafío o puente a otro capítulo. La navegación no es un trámite después de un bloque de texto.

Dejar aire real, alineaciones precisas, ritmo vertical, márgenes y contrastes. Un capítulo no necesita ocupar toda la pantalla ni repetir siempre la misma cuadrícula. Usar una escena a pantalla completa cuando beneficie la exploración y un panel lado a lado cuando facilite comparar causa y efecto.

### Tipografía

- Jerarquía clara: **título editorial > pregunta del experimento > resultado/lectura > notas y fuente**.
- Sans moderna legible para texto; monoespaciada para números, código, coordenadas, unidades y metadatos.
- Evitar titulares completamente en MAYÚSCULAS salvo pequeñas etiquetas de contexto.
- Largo de línea moderado y párrafos cortos: la interfaz no es el lugar para ensayos.
- Números siempre con unidad cuando corresponda; notación matemática correcta y legible, signos y decimales coherentes.

### Color, contraste y profundidad

- Base existente: azules nocturnos y neutros profundos con luz, mallas y acentos luminosos.
- **Cada fenómeno tiene un acento funcional** (por caso o ruta); el acento comunica foco, estado o comparación. En Software: azul rutas, rosa publicación, verde banca. En geoespacial: distinguen modos e instrumentos.
- No usar diez colores de énfasis en la misma vista. Reservar colores de éxito/error para estados reales de la simulación.
- Gradientes suaves y transparencia con moderación; preservar legibilidad sobre fondos complejos.
- Glow y movimiento solo cuando ayuden a percibir trayectoria, jerarquía, selección o transformación.
- Mantener contrastes accesibles, foco visible y alternativa textual a lo puramente visual.

### Movimiento y ritmo

- **00:** obra generativa viva con ritmos distintos para Lissajous, Lorenz y Gielis. Las familias se eligen y no compiten simultáneamente. Pausar fuera del viewport o pestaña oculta; respetar reducción de movimiento.
- **Matemática:** la escena responde al parámetro; no mantener animación continua en escenas estáticas.
- **Terreno, satélites, radar:** transiciones comprensibles entre modos, comparaciones controladas, no efectos atmosféricos que simulen datos reales.
- **Software:** interacción por pasos o fallos, estado visible y explicación que cambia de contexto. El ritmo lo controla la persona.

La fluidez no se evalúa solo por FPS: la pantalla debe responder y no quedar “tildada”, especialmente al entrar y salir de 00 y de 3D.

## 4. Escritura editorial: voz y poda

**Registro:** español natural argentino, técnicamente correcto, claro para alguien que llega por primera vez. Cercano pero no infantil, con curiosidad y precisión; sin venta grandilocuente, jerga vacía ni tutorial autorreferencial.

**Estructura sugerida por pantalla:**
- Título: 3–9 palabras, una pregunta o afirmación intrigante.
- Bajada: una oración de orientación.
- Acción principal: verbo específico (Mover, Elegir, Comparar, Enviar, Detener).
- Interpretación contextual: una idea por selección o estado.
- Fuente/límite solo donde importe, sin desaparecer de la experiencia.
- Cierre: una idea que conecte un modelo con una decisión.

**Regla de edición:** por cada frase, preguntarse “¿agrega información que no está visible en el gráfico o en el texto anterior?”. Si no, borrarla.

**No publicar frases de producción del tipo:** “Esta sección fue adaptada a tus referencias”; “Agregamos un módulo para mostrar”; “Como mencionaste ayer”; “Observá nuestro maravilloso sistema innovador”; “Arquitectura real de Google” (si solo es un ejemplo conceptual). El visitante no conoce el proceso de autoría.

**Comparación breve de tono:**
- No: “Nuestro sistema utiliza diferentes funcionalidades para la visualización de datos geoespaciales”.
- Sí: **“Una altura aislada no cuenta la forma de un valle.”**
- No: “En este apartado aprenderás diversos componentes que están interconectados”.
- Sí: **“Abrís una página. ¿Qué máquinas entran en juego?”**
- No: “Integración de servicios backend, frontend e infraestructura de forma escalable”.
- Sí: **“La solicitud llega. ¿Quién decide si es válida?”**
- No: “Esta imagen es una representación completamente ficticia del radar meteorológico”; repetido tres veces.
- Sí, en la etiqueta de fuente: **“Simulación didáctica · sin datos meteorológicos en vivo.”**

**Advertencias honestas, no invasivas:** cuando existe riesgo de malinterpretación, la leyenda de simulación, fecha, CRS o dato real debe estar disponible en la escena y explicación detallada en un panel discreto. Evitar ocultar por estética información crítica.

## 5. Fundamentos de didáctica visual

Secuencia recurrente (adaptada al caso): **observar → anticipar → intervenir → contrastar → explicar → comprobar**.

- **Predicción:** “¿qué pasará al aumentar resolución?”, “¿qué falla si falta CRS?”.
- **Manipulación:** el usuario cambia exactamente aquello de lo que habla la pregunta.
- **Feedback:** una consecuencia visual o numérica suficiente para contrastar la predicción.
- **Explicación:** breve, causal y conectada a fórmula, dato o mecanismo.
- **Transferencia:** mini reto nuevo o comparación de un segundo escenario.

Favorecer descubrir relaciones, no memorizar listas. Ejemplo de transición deseada:

`f(x,y) → pendiente/gradiente → grilla de terreno → DEM real → solicitud API → validación/almacenamiento → hardware y red`.

Una interfaz atractiva no demuestra comprensión. Medir aprendizaje requerirá pruebas con usuarios externos; no inventar resultados pedagógicos.

## 6. Traducción por ruta

### Matemática

Acentuar relaciones y consecuencias. Mostrar fórmulas y dominios cuando la geometría no es obvia; modelos comparables (esfera/cilindro/cono/paraboloide), no una lista de conceptos. En 00, preservar la fuerza artística y la libertad exploratoria. En 09, conservar el terreno imperfecto y la equivalencia de representaciones.

### Geoespacial

Hacer visible la escala, la deformación, la resolución, los sistemas de referencia y los límites de lo observado. `13` distingue muestreo SRTM real de DEM nativo; `14` geometría orbital idealizada de seguimiento real; `15` radar meteorológico, Doppler y SAR como instrumentos diferentes.

Representar con cuidado: un mapa no es el territorio; un píxel no es la verdad absoluta; una pendiente calculada no es un diagnóstico de riesgo; un eco de radar no es automáticamente precipitación acumulada.

### Software

**Personas y consecuencias antes que nomenclatura.** Un clic de usuario puede atravesar procesos, protocolos, reglas, datos y equipos; no todo ocurre en una pila monolítica. Permitir comparar solicitud correcta, errónea y reintento. Distinguir cliente y servidor; archivo persistente, proceso y memoria; Docker, Kubernetes y cloud como responsabilidades distintas, no escalones obligatorios.

El dibujo vectorial e interactivo del hardware puede inspirar diagramas de sistemas, pero no reutilizar cada estilo idénticamente: evitar monotonía.

## 7. Criterios para aprobar una pieza visual o texto

Una contribución se integra solo si:

- **Legible en primera visita:** la pregunta y la acción son reconocibles sin leer el README.
- **Causal:** cada control cambia algo significativo; no hay botones de adorno.
- **Correcta:** el resultado surge del mismo modelo o fuente declarada.
- **Honesta:** se distinguen visualmente simulación, dato real, inferencia y ejemplo.
- **Sobria:** no hay duplicación verbal ni bloques que compitan por atención.
- **Responsiva y accesible:** teclado, foco, móvil, contraste, estados, `prefers-reduced-motion`.
- **Rápida:** sin animaciones innecesarias, bundle pesado o petición externa bloqueante.
- **Continuable:** el próximo agente entiende por qué se eligió la solución y dónde está el código.

**Pregunta final de dirección de arte:** *si quitamos el efecto visual, ¿se pierde una idea?* Si no, probablemente sea decoración prescindible.
