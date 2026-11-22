# G4 · Del sensor al servicio industrial

**Fecha:** 2026-11-21  
**Estado:** guía educativa en PR; no afirmar que está publicada ni aprobada hasta confirmar CI y despliegue.  
**Ámbito:** ruta Software / Producto, después de 20 Hardware y del puente G3. **No ocupa 21 Datos y consultas ni altera Matemática 00–09 o Geoespacial 10–16.**

## Pregunta educativa

¿Cómo una necesidad del terreno se convierte en señal física, datos, software, decisiones y un servicio industrial vendible?

Un visitante debe poder:
- distinguir fenómeno, transductor, adquisición, alimentación, comunicación, ingesta y uso;
- explicar por qué un enlace caído no equivale a perder alimentación;
- evitar interpretar «dato transmitido» como «dato validado», o «seguimiento» como «control remoto»;
- identificar etapas de demanda, diagnóstico, piloto, compras, puesta en marcha y soporte B2B;
- comparar los casos conceptuales de testigos mineros, seguimiento de un dispositivo en un ducto y documentación de redes.

## Decisión

Agregar **una guía G4 autocontenida e interactiva**: 
- tres casos seleccionables, cada uno con información específica;
- dos recorridos (siete etapas técnicas y seis comerciales);
- una interacción determinista de alimentación disponible/interrumpida y enlace conectado/sin cobertura;
- consecuencias textuales y semánticas de cada estado;
- marcas voluntarias de caso explorado, sin atribuir aprendizaje verificado.

**No se agrega**: sensor real, API, base de datos, hardware ni dependencias, ni se convierte esto en una nueva plataforma/roadmap.

**Alternativas descartadas:** una infografía estática larga (sin cambio causal ni exploración) y un nuevo capítulo 21 (ya reservado a datos/SQL).

## Evidencia y cautelas

Los casos son **didácticos**, inspirados en patrones generales estudiados en entrevistas profesionales, no planos ni reconstrucciones de arquitectura de terceros.

- Testigos: técnicas de imagen y espectroscopía son alternativas instrumentales; no suponer que todo escáner usa todas ellas.
- Ductos: observar por vibración/paso es distinto de controlar la posición o movimiento de un dispositivo de limpieza.
- Telecomunicaciones: CAD a GIS es una práctica de documentación; el sistema resultante no es necesariamente offline-first.
- El estado «sin red, almacenamiento local» es **condicional a que exista buffering en el dispositivo**; la demo declara esta hipótesis.
- Los modelos no transmiten datos, no controlan actuadores y no constituyen alertas ni recomendaciones operativas.

**Procedencia interna:** reflexión del 2026-11-21 en el vault privado `geoplatform-knowledge-base/08 - Ideas/2026-11-21 - Del sensor al servicio industrial - aprendizajes y oportunidades.md`. No exponer contactos, información no pública de entrevistas ni inventar aprobación de empresas.

## Código y QA

- Datos/modelo puro: `src/industrial-pipeline.ts`.
- Vista: `src/IndustrialSystemsGuide.tsx`.
- Estilos locales: `src/industrial-guide.css`.
- Navegación: `src/content.ts`, `src/main.tsx`.
- Compatibilidad del cálculo: `src/measure.ts`.
- Pruebas: `tests/industrial-pipeline.test.mjs`.

**Verificar antes de merge:** `npm test`, `npm run build`, CI de PR, QA visual responsive (móvil incluido), foco de teclado, reducción de movimiento, legibilidad, y luego desplegado por separado.

## Fuentes conceptuales para ampliar, sin introducir contenido falsamente actual

- Documentación educativa sobre sensores, transductores y circuitos de adquisición.
- Manuales de redes industriales y sistemas con conectividad intermitente.
- Documentación de interfaces GIS/CAD, procedencia de datos e incertidumbre.
- Materiales públicos técnicos del fabricante específico antes de atribuirle instrumentos.
- Entrevistas con equipos profesionales para distinguir venta, compras, contratación, implantación y soporte.

**Criterio de resultado:** cada selección modifica información relevante de forma explicable y testeable. La guía no desplaza las prioridades de QA del laboratorio ni obliga a iniciar otro producto.
