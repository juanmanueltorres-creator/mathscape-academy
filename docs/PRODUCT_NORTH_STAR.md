# Mathscape Academy — Product North Star

**Estado de referencia:** 2026-11-08 · V1.2 · 21 capítulos (00–20) en `main`.
**Autoridad:** visión y criterio editorial para las próximas iteraciones. Verificar siempre el código y CI actuales antes de afirmar que algo está implementado.

> **Hacer visible lo invisible.** La matemática describe formas y cambios; la geoespacial los sitúa en la Tierra; el software convierte modelos, datos e intenciones en experiencias y decisiones.

## 1. Propósito

Mathscape es un **laboratorio narrativo e interactivo** para comprender sistemas complejos de manera precisa, creativa y accesible. No es un libro digital con tarjetas animadas, una plataforma masiva de cursos, un clon de documentación ni un portfolio disfrazado de aula.

El visitante aprende **tocando un modelo, observando qué cambia, entendiendo por qué y comprobando un resultado**. La emoción estética despierta curiosidad; la interacción transforma esa curiosidad en comprensión; el fundamento permite transferir lo aprendido fuera del laboratorio.

**Tres rutas, un mismo hilo:**

- **Matemática (00–09):** funciones, cálculo, álgebra, superficies, modelos, gradientes; la abstracción se vuelve visible y luego se aplica al relieve.
- **Geoespacial (10–16):** Tierra, proyecciones y geodesia, ráster/vector, sensores, DEM real muestreado, órbitas, radar meteorológico y SAR.
- **Software / Producto (17–20):** de una necesidad humana a una interfaz, solicitud HTTP, contrato JSON, reglas, hardware, sistema operativo, red y respuesta.

No exigir completar las rutas en orden. Establecer **puentes semánticos**: 05 integrales dobles → 09 volúmenes de relieve; 08 gradiente → 09 pendiente; 09 terreno → 13 muestras SRTM; 10–16 coordenadas/sensores → 17–19 aplicaciones geoespaciales; 18–19 petición → 20 hardware, SO y red.

## 2. Audiencia y nivel

Personas curiosas que entran sin contexto, estudiantes de matemática, geociencias, geografía, sistemas y profesionales que desean **conectar fundamentos con decisiones reales**. La entrada debe ser legible sin conocer términos previos. La profundidad no se elimina: se revela por capas (escena → exploración → explicación → fórmula/dato/fuente → desafío).

No escribir como si el lector ya conociera el producto, la conversación o al creador. Evitar la voz interna de desarrollo en el texto de usuario.

## 3. Contrato de una experiencia Mathscape

Cada escena responde con claridad:

1. **Una pregunta interesante.** ¿Qué fenómeno real o conceptual estamos mirando?
2. **Un objeto o relación manipulable.** La persona cambia una variable, caso, capa, etapa, cámara o condición.
3. **Una consecuencia visible.** La gráfica, el diagrama, una métrica o el resultado cambia de forma comprobable.
4. **Una explicación breve y rigurosa.** Qué significa ese cambio y qué no significa.
5. **Un cierre útil.** Microdesafío verificable y puente hacia otra idea o aplicación.

La fórmula no es decoración; debe coincidir con el algoritmo que produce el gráfico. No marcar “aprendido” por entrar a una pantalla. La evaluación de interacción es un indicador limitado, **no evidencia de aprendizaje** sin investigación con estudiantes.

### Modelo editorial para software

**Necesidad → promesa de producto → acción → solicitud y validación → reglas y datos → estado → consecuencia.**

Casos representativos: obtener una ruta, publicar contenido, solicitar una transferencia, pedir un análisis de terreno. Las arquitecturas de empresas famosas son referencias **conceptuales**, no afirmaciones sobre sistemas internos no publicados. Un 202 Accepted es **pendiente**, no liquidación. Un ejemplo de API ilustrativo no envía datos ni modifica cuentas.

## 4. Lo que debe preservarse

El creador destacó particularmente:

- **00 · Atlas generativo:** entrada con personalidad, arte vivo, composiciones Lissajous/Lorenz/Gielis **separadas y elegibles**, ritmo controlado, sin sobrecarga ni congelamientos. Es una puerta visual, no un panel de información.
- **09 · Del cálculo al terreno irregular:** capítulo bisagra, singular por combinar matemáticas y geociencias. Preservar la equivalencia de las vistas 2.5D, curvas y Three.js 3D derivadas de la misma función de elevación, no mezclarlas con mediciones reales.
- **13 · DEM de San Juan:** enfatizar diferencia entre muestra real SRTM guardada (81 puntos) y el GeoTIFF original que **no se descarga**; fuente, CRS, datum, interpolación y limitaciones accesibles.
- **14 · Satélites:** hacer comprensible qué observa cada misión, órbita frente a revisita, modelo idealizado frente a posición real; las trayectorias no son efemérides en vivo.
- **15 · Radares:** distinguir reflectividad dBZ, velocidad Doppler y retrodispersión SAR, sus unidades y lo que NO miden; no inventar alertas operativas.

**00 y 09 son capítulos faro. 13–15 tienen margen de mejora visual y narrativa**, sin sacrificar rigor ni sobreescribir lo que ya funciona.

## 5. Brújula de producto

**Sí:**
- Experimentos cortos, explorables, precisos; pequeños descubrimientos encadenados.
- Storytelling científico/editorial, diseño gráfico significativo, humor conceptual donde corresponda.
- Casos imperfectos: terreno irregular, datos incompletos, errores de API, fallos de red, incertidumbre y límites.
- Ejemplos con fuente, fecha, unidad, proyección, método y restricciones cuando aplique.
- Software explicado desde la persona y las consecuencias, no desde un listado de frameworks.
- Explorar imágenes, referencias, repos y planes de estudio antes de diseñar, sin copiar contenido protegido.
- Elementos visuales propios y ligeros; SVG y Canvas interactivos antes que imágenes estáticas si el tema exige manipulación.

**No:**
- Nuevo framework, dashboard o plataforma por cada idea.
- Paredes de texto, repetición de definiciones, estadísticas descontextualizadas, comparativas de logos sin pregunta.
- 3D, animación o efectos “porque quedan espectaculares” si no explican algo concreto.
- Atribuir arquitecturas no verificadas a Instagram, Google Maps, Mercado Libre o bancos.
- Tratar simulaciones y ejemplos como observaciones científicas o datos operacionales.
- Agregar IA/AGENTES, autenticación, base de usuarios, seguimiento de progreso o infraestructura compleja sin problema educativo validado.
- Volver a dividir el 00 en un collage excesivo o ejecutar loops pesados cuando la escena no está visible.

## 6. Estado real y límites

La versión implementada se determina por `src/content.ts` (`SceneId`, `lessons`) y el estado de `main`, **no por el título histórico del README ni por planes de versiones antiguas**.

- React 19, TypeScript, Vite; Canvas 2D/2.5D como base, Three.js solo para terreno 3D bajo demanda; SVG/HTML para diagramas.
- Algoritmos puros y métricas testeadas, escenas estáticas renderizadas a demanda, Atlas pausado cuando no visible y soporte para `prefers-reduced-motion`.
- V1.2 contiene 21 escenas, incluyendo 17–20 Software, pero **eso no prueba validación visual de la última versión publicada**.
- En la última verificación (2026-11-08), CI de GitHub en `main` pasó 105 pruebas y build; Vercel reportó **límite diario de despliegues**. No afirmar que producción muestra V1.2 hasta verificar el commit servido.

## 7. Próximas decisiones: secuencia sugerida, no obligación

1. **QA en dispositivo real / navegador**, escritorio y móvil, contraste, superposiciones, botones, editor JSON y escena de hardware; comprobar el despliegue correspondiente sin generar builds innecesarios.
2. **Refinar 00, 09 y 13–15**, con especial foco en narración concisa, control de carga y continuidad entre capítulos; hacer cambios pequeños y medibles.
3. **21 · Datos y consultas**, laboratorio pequeño con tablas, relaciones, filtros, SQL y restricciones usando un caso territorial; demostrar persistencia vs memoria y validez de datos. Si el número 21 ya estuviera ocupado, inspeccionar `src/content.ts` primero.
4. **22 · Infraestructura y despliegue**, distinguir proceso, servidor, contenedor, Kubernetes, nube, CDN y bases de datos. Simular decisiones de escalado o fallo, no representar estas herramientas como niveles físicos obligatorios.
5. Más adelante: rendimiento p95/carga/costo, arquitectura comparada, casos de GeoPlatform, Opportunity OS y Question Radar con **evidencia del código real**, no promesas de funcionalidades futuras.
6. En geoespacial: interpretación de datos satelitales abiertos con procedencia, cartografía temática, alertas **oficiales** contextualizadas, ambiente/comunidades e incertidumbre, después de validar las bases.

**Criterio de prioridad:** fortalecer una experiencia existente y terminarla antes de abrir tres nuevas. Una escena terminada, comprendida y verificable vale más que diez ideas incompletas.

## 8. Gobernanza documental

- `AGENTS.md`: **puerta de entrada y reglas operativas para agentes**.
- `docs/PRODUCT_NORTH_STAR.md`: este documento, propósito, límites y prioridades.
- `docs/CREATIVE_EDITORIAL_DIRECTION.md`: dirección artística, composición, voz y ejemplos.
- `docs/ARCHITECTURE_DECISIONS.md`: decisiones y justificación, con fecha y trade-offs.
- `docs/AGENT_WORKFLOW.md`: lectura, inspección, pruebas, PR y QA.
- `docs/PLAN_CURRICULAR.md` y demás `docs/*V*.md`: fundamentación y evolución **históricas**, algunas afirmaciones de estado ya quedaron desactualizadas. **No borrarlas ni tomarlas como inventario vigente.**

Cuando cambie una decisión de producto, actualizar los documentos **junto con el código**. Cuando el objetivo o los principios entren en conflicto, no reinterpretarlos silenciosamente: explicitar el trade-off en el PR y solicitar decisión humana si cambia el norte.

---

**Resumen de una frase para agentes:** Mathscape enseña a mirar, experimentar y entender matemáticas, territorio y sistemas mediante escenas artísticas precisas, interacciones significativas y narrativa editorial sin ruido.
