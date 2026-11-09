# G3 · La inteligencia artificial también es un sistema
**Fecha:** 2026-11-09 · **Alcance:** experiencia puente después de 20 · Hardware en la ruta Software; no renumera 21 Datos / 22 Infraestructura.

## Pregunta educativa
¿Qué sucede desde que una persona escribe una entrada hasta que un sistema de IA produce, comprueba o ejecuta una respuesta, y qué distingue al modelo del proveedor o del agente?

La ruta de seis pasos mantiene una pieza visual principal y controles causales:
1. **Entrada / I/O:** texto ilustrativo → identificador → vector unitario 2D. Se usa separación por espacios y checksum para que el proceso sea reproducible; **no es un tokenizador ni un embedding real**.
2. **Entrenamiento:** descenso de gradiente sobre una regresión lineal con tres muestras sintéticas. Un cambio en tasa y pasos modifica peso y pérdida; **no es la función de entrenamiento de un LLM**.
3. **Atención:** un vector de consulta q compara tres claves; scores, softmax, valores y salida. La temperatura agregada a esta escena es didáctica, distinta del ajuste de temperatura en generación.
4. **Inferencia:** logits sintéticos, temperatura, normalización y muestreo controlado para una única salida. No se efectúa inferencia de modelos preentrenados; no explica de por sí la coherencia de un texto largo.
5. **Arquitecturas / proveedores:** contraste conceptual entre predicción autoregresiva, clasificación discriminativa y difusión. Separación modelo / empresa / API / producto / nube / agente. Fuentes oficiales de OpenAI, Anthropic, Google, xAI, Meta, Mistral AI y DeepSeek, sin rankings o precios que envejecen rápidamente. Pueden existir modelos híbridos y variantes que exceden esta tipología introductoria.
6. **Agentes:** simulación de objetivo → selección de herramienta → I/O → prueba → resultado. Si falla una herramienta o criterio, debe detenerse. Distinguir supervisión de automatización ciega.

## Historia / spec
La guía G2 permanece como la exploración histórica: SRS → spec-driven; plugins / RPC → tool calling / MCP; recuperación → RAG; scripts / CI → agentes; documentación de colaboración → AGENTS.md. No publicar la formulación de las solicitudes del creador, ni sostener que los mecanismos antiguos y los nuevos son idénticos. G3 enlaza el contrato de 18–20, G1 y G2.

## Modelos puros y garantías
- `src/ai-stack.ts`: funciones puras (softmax estable, muestreo con umbral, codificación sintética, trazas de verificación), sin red ni clave de API.
- `src/AIStackGuide.tsx`: vistas y controles alimentados por esos mismos resultados; `src/ai-stack.css` responsive con foco y reducción de movimiento.
- `tests/ai-stack.test.mjs`: invariantes numéricos, extremos, reproducibilidad y estados de detención.
- Un laboratorio es **explorado**, no acreditado como aprendizaje medido. No se intenta persuadir al visitante de que los proveedores tengan la misma arquitectura, apertura, licencia, límite o costo.

## Fuentes primarias
- Vaswani et al. (2017), *Attention Is All You Need*: https://arxiv.org/abs/1706.03762
- Rumelhart et al. (1986), *Learning representations by back-propagating errors*: https://www.nature.com/articles/323533a0
- Ho et al. (2020), *Denoising Diffusion Probabilistic Models*: https://arxiv.org/abs/2006.11239
- Yao et al. (2022), *ReAct*: https://arxiv.org/abs/2210.03629
- Lewis et al. (2020), RAG: https://arxiv.org/abs/2005.11401
- GitHub Spec Kit: https://github.github.com/spec-kit/
- MCP: https://modelcontextprotocol.io/introduction
- Proveedores y licencias deben consultarse en los enlaces oficiales de la propia estación; no son equivalentes un servicio gratuito, licencia open source, open weights, hospedaje local o API paga.

## QA
1. `npm test`, `npm run build` (TypeScript + Vite).
2. Navegar las seis estaciones en ~390, 768 y 1440 px; comprobar tabulaciones, activación, legibilidad y overflow.
3. Cambiar temperatura y muestreo: distribución normaliza a 1, misma muestra = mismo resultado.
4. Desactivar herramienta y test: nunca marcar ejecución lista cuando faltan condiciones.
5. Comprobar que G1/G2, 00/09/13–15/20 siguen funcionando.
6. Revisión CI para SHA final y vista previa Vercel **del mismo commit**; QA visual y producción se declaran solo tras inspección independiente.

## Pendientes y límite editorial
Una ruta profunda sobre arquitectura Transformer podría añadir embedding, posición, capas feedforward, residuals, normalización, paralelismo, entrenamiento, fine-tuning y KV-cache, pero solo si cada operación tiene una visualización precisa, sin saturación. No fingir una visualización de pesos reales. Distinguir modelos de texto, visión, audio, multimodales y difusión cuando se amplíe. La experiencia G3 resuelve el recorrido conceptual antes de sumar más fenómenos.
