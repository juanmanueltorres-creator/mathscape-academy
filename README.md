# Mathscape Academy · laboratorio de matemática interactiva

**Estado:** prototipo educativo V0.1. No está desplegado ni conectado a aplicaciones existentes.

## Objetivo

Enseñar matemáticas mediante una secuencia breve de observar → experimentar → explicar → resolver, con especial profundidad en derivadas, integrales, matrices y, a futuro, cálculo multivariable. Mantener un repaso contextual de álgebra, funciones y trigonometría.

## Arquitectura

- React + TypeScript + Vite: capítulos, estado, navegación y accesibilidad.
- Canvas 2D: plano cartesiano, rectas, curvas, sumas de Riemann y grillas transformadas.
- `src/math.ts`: cálculos matemáticos puros, verificables.
- `src/canvas.ts`: dibujo y explicaciones conectados a las mismas fórmulas.
- `tests`: validaciones de secante, suma integral, matrices.
- No usa Blender, Three.js, backend, API ni inteligencia artificial.

## Demo autónoma (sin instalar)

Abrir `demo.html` directamente en el navegador. Esta demo comparte el motor matemático y de dibujo del proyecto React, y permite probar las cuatro escenas sin dependencias.

## Inicio

```bash
npm install
npm run dev
```

Abrir la URL que muestre Vite. En otro terminal:

```bash
npm run test
npm run build
```

> No se instaló `node_modules` al preparar este paquete: el entorno de creación no tenía acceso al registro npm. Requiere conexión para `npm install`.

## Roadmap (hipótesis de aprendizaje; medir antes de ampliar)

| Tramo | Microescenas | Evaluación |
|---|---|---|
| Repaso contextual | funciones, coordenadas, trigonometría | pendiente, dominio, lectura de gráficos |
| Límites | aproximación por ambos lados, continuidad | distinguir límite de valor de función |
| Derivadas | secante→tangente, producto/cadena, optimización | predecir signo y magnitud de la pendiente |
| Integrales | sumas izquierdas/derechas, valor exacto, TFC, sustitución | aproximar y explicar convergencia |
| Álgebra lineal | vectores, matriz 2×2, sistemas, determinantes, autovalores | visualizar transformación y resolver Ax=b |
| Multivariable | superficies 3D cuando sea necesario, gradiente, jacobiano | analizar pendientes y cambios de área |
| Aplicación | movimiento, terreno, optimización, ecuaciones diferenciales | transferir a problemas reales |

### Principios

- **La figura no debe contradecir a la fórmula.** La suma integral dibujada usa la misma función y los mismos límites que el cálculo numérico.
- Cuando se visualiza la integral se aclara que se trabaja con una función positiva en `[0,b]`; por tanto, el área representada coincide con la integral definida.
- Los controles son táctiles y navegables por teclado.
- Sin backend ni recopilación de datos personales.
- No liberar nuevas escenas antes de verificar el aprendizaje y la corrección matemática.

## Fuentes curriculares

- [OpenStax Cálculo 1](https://openstax.org/books/c%C3%A1lculo-volumen-1/pages/prefacio)
- [MIT Single Variable Calculus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/)
- [MIT Linear Algebra](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/)
- [Argentina NAP](https://www.argentina.gob.ar/nucleos-de-aprendizaje-prioritarios)

## Próximos pasos

1. Hacer pruebas exploratorias de aprendizaje con 2–3 personas.
2. Agregar predicción previa a mover el control para evitar interacción mecánica.
3. Construir el módulo de límites y derivadas de funciones distintas a `x²`.
4. Crear la planificación de capítulos más profundos de cálculo y álgebra lineal.
5. Publicar solo cuando el usuario lo decida.

Plan curricular detallado: `docs/PLAN_CURRICULAR.md`.