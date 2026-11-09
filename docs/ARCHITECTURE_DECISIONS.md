# Mathscape Academy — Decisiones de arquitectura, pedagogía y producto

**Registro de decisiones (ADR ligero).** Corte: 2026-11-08. No confundir decisiones vigentes con propuestas futuras. Cada cambio que altere este documento requiere motivo, riesgo, alternativa y prueba.

## Convenciones

- **Aceptada** = regla en vigor; no reemplazar por gusto personal.
- **En evaluación** = se investiga antes de implementar.
- **Diferida** = idea interesante, no prioridad de producto.
- **Superada** = decisión histórica reemplazada, con referencia nueva.

## D-001 · Tres rutas conectadas, no tres productos

**Estado:** Aceptada. **Motivo:** los mismos fundamentos explican un modelo matemático, el territorio y una aplicación. **Decisión:** Mathscape es un único producto con rutas Matemática (00–09), Geoespacial (10–16) y Software/Producto (17–20). Su secuencia se configura en `src/content.ts`. **Trade-off:** la navegación crece y exige puentes didácticos; no construir tres aplicaciones independientes.

## D-002 · Experimento antes que enciclopedia

**Estado:** Aceptada. Una escena está dirigida por una **pregunta, una manipulación, una consecuencia, una explicación y una comprobación**. El usuario controla cuánto detalle revela. **Se rechazó:** reemplazar experiencias por imágenes informativas densas, tarjetas interminables o inventarios de librerías.

## D-003 · Arte generativo como umbral

**Estado:** Aceptada. El capítulo 00 tiene lenguaje artístico y responde al rendimiento real del dispositivo. Lissajous, Lorenz y Gielis son **alternativas seleccionables**, no tres motores animados compitiendo siempre. Pausar loops cuando no son visibles o el usuario reduce movimiento. **Prueba:** no bloquear la UI al entrar/salir de 00.

## D-004 · Un modelo matemático, varias vistas de terreno

**Estado:** Aceptada. En 09, el mismo relieve **sintético** alimenta 2.5D, curvas de nivel y 3D; perfiles, pendientes y volúmenes tienen que corresponder al mismo modelo. No confundir discretización, medición y errores instrumentales. **Se rechazó:** tres escenas desconectadas con datos no comparables. **Referencia:** `docs/GEOSPATIAL_BRIDGE.md` y `docs/TERRAIN_3D_RESEARCH_V07.md`.

## D-005 · WebGL solo donde agrega significado

**Estado:** Aceptada. Canvas 2D/2.5D y SVG para la mayoría de las vistas; Three.js vía import dinámico en terreno 3D. Renderizar ante cambios de escena, cámara o parámetros; liberar recursos al desmontar. **Se diferió:** R3F, Cesium, deck.gl y motores pesados por defecto. **Riesgo evitado:** sobrecoste de bundle, batería y GPU.

## D-006 · Datos reales identificables y seguros

**Estado:** Aceptada. Capítulo 13 usa **81 elevaciones muestreadas** desde SRTM a través de OpenTopoData, guardadas como snapshot con procedencia. No se trata del GeoTIFF original ni prueba precisión de una obra. Si falla la actualización externa, **conservar el último snapshot real validado**, mostrar el fallo y no fabricar alturas. En satélites y radar indicar cuándo se trata de modelos geométricos y señales sintéticas. **Referencia:** `docs/GEOSPATIAL_V08_SATELLITES_DEM_RADAR.md`.

## D-007 · Cartografía y geodesia sin falsas equivalencias

**Estado:** Aceptada. No equiparar grados a metros, lat/lon a proyectadas ni POSGAR07 (marco) a una proyección. La transformación ilustrativa WGS84/Gauss-Krüger **no equivale a transformar datum/época a POSGAR07**. No presentar resultados didácticos como coordenadas de ingeniería. **Referencia:** `docs/GEODESY_UTM_POSGAR_V09.md`.

## D-008 · Los sistemas se cuentan desde el usuario

**Estado:** Aceptada. Capítulos 17–18: caso de rutas, publicaciones y transferencias; desde una necesidad a acciones, HTTP, reglas, datos y respuesta. Distinguir consecuencia de producto y mecanismo. Diferenciar un ejemplo conceptual de la arquitectura real de Google, Meta, Mercado Libre o bancos. No mostrar tecnologías concretas sin justificar qué problema resuelven.

## D-009 · Validaciones de API locales y honestas

**Estado:** Aceptada. Capítulo 19 tiene contratos didácticos en el navegador: JSON malformado 400, estructura o reglas inválidas 422, recurso creado 201, solicitud pendiente 202. Rechazo no cambia datos; una transferencia no se simula como dinero liquidado. **No hay backend ni transacciones reales en ese laboratorio.** El feedback debe reflejar los valores realmente aceptados, no respuestas fijas contradictorias. **Referencia:** `src/api-contract.ts`, tests.

## D-010 · Hardware y red como conceptos diferentes

**Estado:** Aceptada. Capítulo 20: placa madre **SVG interactiva** con componentes seleccionables, arranque firmware/bootloader/kernel/servicios/aplicación y recorrido web entre equipo local y servidor remoto. DNS puede usar caché, HTTPS sobre TCP y HTTP/3 sobre QUIC difieren, y la GPU dedicada no es requisito para navegar. **Se rechazó:** presentar hardware, kernel, Docker, Kubernetes y cloud como una pila física obligatoria. **Implementación:** `src/hardware.ts`, `src/HardwareStage.tsx`.

## D-011 · Reutilizar patrones, no copiar diseños ajenos

**Estado:** Aceptada. Las infografías compartidas se usan como referentes de **narrativa, jerarquía y causalidad**, no se incrustan como afiches ni se clonan. Diagramas propios, identidad consistente y elementos interactivos cuando haya valor educativo. Una imagen externa requiere licencia verificable, atribución y razón didáctica. Animaciones y logos no deben saturar la pantalla.

## D-012 · Edición precisa, sin voz interna de desarrollo

**Estado:** Aceptada. Una idea dominante por escena; texto corto, técnico y legible en primera visita; una explicación aparece cuando se la necesita. **No publicar** “adaptado al usuario”, “se añadió este módulo”, referencias a conversaciones previas, relleno motivacional o autopromoción. La voz describe el fenómeno y el efecto, no las decisiones de quien diseñó la pantalla. **Referencia:** `docs/CREATIVE_EDITORIAL_DIRECTION.md`.

## D-013 · Calidad antes de main

**Estado:** Aceptada. Inspeccionar → cambio aislado en rama → pruebas numéricas y semánticas → `npm run build` (TypeScript + Vite) → PR → revisión → merge. No afirmar QA visual ni despliegue productivo sin inspección de la versión real. Errores de Vercel por cuota no equivalen a errores de TypeScript: investigar separados. Los datos de tests y estado del último commit son **históricos**, revisar nuevamente en cada trabajo.

## D-014 · Dependencias y escala por necesidad demostrada

**Estado:** Aceptada. Un gráfico simple no necesita React Flow ni una SPA nueva. Una explicación de arquitectura no requiere instalar Docker o Kubernetes; una base de datos didáctica no implica conectar infraestructura real. Preferir código local comprensible y comprobable mientras alcance. Si una librería externa mejora sustancialmente el modelo, documentar tamaño, mantenimiento, licencia, alternativas y tests antes de agregarla.

## D-015 · Autonomía de agentes con límites

**Estado:** Aceptada. Un agente puede **investigar, proponer, implementar, probar, corregir y documentar iteraciones autorizadas**. No debe: alterar producción sin necesidad explícita, hacer merges fallidos, inventar verificación, modificar otros repositorios, publicar secretos, cambiar el norte silenciosamente ni iniciar tres desarrollos inconclusos. Si el usuario autoriza la iteración y el proceso normal, no pedir reconfirmación por cada cambio de bajo riesgo; detener acciones de mayor impacto o irreversibles hasta contar con autorización y controles.

## D-016 · Próximo capítulo, luego de QA: datos y consultas

**Estado:** En evaluación. Diseñar **21 · Datos y consultas** con tablas, relaciones, restricciones, índices o filtros y un caso territorial que conecte 19 y 20. No empezar por contenedores o infraestructura. El experimento debe permitir provocar un dato inválido, ver una restricción y contrastar consulta correcta con incorrecta. **Evitar falsa simulación SQL** que enseñe una sintaxis errónea: implementar un subconjunto explícito o un motor local confiable, aclarando limitaciones.

## D-017 · IA como puente verificable entre matemática y software

**Estado:** Aceptada para implementación educativa del puente G3. **Motivo:** los ejercicios aislados de neurona, gradiente y atención no mostraban el recorrido de un sistema de IA ni distinguían modelos, proveedores y agentes. **Decisión:** ampliar la ruta Software después del hardware mediante una guía G3 autocontenida, sin alterar los números 21/22 ni agregar una cuarta plataforma. **Límites:** ejemplos sintéticos puros, sin inferencia remota, sin rankings comerciales ni equiparar open weights a open source. **Pruebas:** `tests/ai-stack.test.mjs`, CI de PR y QA visual pendiente según la versión desplegada. **Fuente:** `docs/AI_STACK_GUIDE.md`.

## Plantilla para nueva decisión

```md
## D-0XX · Nombre breve
**Fecha:** AAAA-MM-DD
**Estado:** Propuesta | Aceptada | Diferida | Superada
**Problema:** necesidad educativa o técnica
**Alternativas:** opciones evaluadas
**Decisión:** qué hacemos y qué no hacemos
**Efecto:** experiencia del estudiante, calidad, rendimiento, mantenimiento
**Pruebas:** código, tests, fuentes y QA visual
**Revisión:** condiciones que justificarían cambiarla
```

Cuando una decisión cambie, conservar su historia y añadir otra entrada con referencia a la anterior.
