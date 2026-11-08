# Mathscape Academy V0.2 — The Mathematical Playground

**Estado:** desarrollo local / rama de revisión. Sin despliegue público, sin backend y sin Blender.

Experiencia en React + TypeScript + Vite con gráficos científicos y matemáticas verificables. Recupera los experimentos generativos iniciales (Lissajous, Lorenz y superfórmula) y va más allá de una colección de tarjetas: **nueve escenas interactivas**, controles matemáticos, desafíos y comparación entre aproximaciones y soluciones exactas.

## Explorar

| N.º | Experimento | Interacción |
|---|---|---|
| 00 | Atlas generativo | Frecuencias de Lissajous, fase, alternar sistemas visuales y rotación |
| 01 | Funciones | Parámetros de la cuadrática y comparación con seno |
| 02 | Límites | `sin(x)/x` y aproximación bilateral a cero |
| 03 | Derivadas | Secante y tangente en `f(x)=x²` |
| 04 | Integrales definidas | Rectángulos de Riemann izquierdos |
| 05 | **Integrales dobles** | Superficie `z=1+a(x²+y²)` sobre un cuadrado, suma de puntos medios n×n |
| 06 | Matrices | Transformación 2×2, grilla y determinante |
| 07 | **Ecuaciones diferenciales** | `y'=ky`, Euler explícito y solución exacta |
| 08 | **Derivadas parciales** | Gradiente de un paraboloide sobre superficie rotatoria |

## Ejecutar

```bash
npm install
npm run dev
npm test
npm run build
```

La URL dev se abrirá desde la terminal Vite. No se despliega automáticamente.

## Arquitectura

- `src/main.tsx` — shell y estado React, navegación, controles accesibles, progresión.
- `src/content.ts` — programa de escenas y controles, editable sin cambiar el motor.
- `src/math.ts` — algoritmos puros y funciones exactas.
- `src/measure.ts` — métricas, error, fórmulas y validaciones de desafíos.
- `src/visuals.ts` — dibujo Canvas 2D, proyección de superficies 3D sobre 2D.
- `src/styles.css` — dirección visual, responsive, contrastes.
- `tests/advanced.test.mjs` — pruebas matemáticas de cálculo avanzado.

### Criterios de corrección

1. Los valores de la UI provienen de las mismas funciones puras que los gráficos.
2. El módulo de integral doble usa suma de Riemann de puntos medios con área de celda `(2b/n)²`. El valor exacto es `4b²+(8/3)ab⁴`.
3. La escena EDO representa Euler explícito y compara el mismo modelo con `y0·exp(k t)`.
4. La proyección de superficies es una **vista 2.5D**, no una escena WebGL; la posición/altura corresponde a la función indicada.
5. Las formas generativas son un lenguaje visual experimental, no una interpretación científica de datos externos.
6. `demo.html` es una **demo anterior** de V0.1 conservada por compatibilidad; la versión actual y completa corre con Vite/React.

## Camino educativo

Repaso breve → límites → derivadas e integrales → matrices → superficies, derivadas parciales e integrales dobles → ecuaciones diferenciales → aplicaciones geoespaciales.

Fuentes de referencia: [OpenStax Cálculo](https://openstax.org/subjects/math), [MIT Single Variable Calculus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/), [MIT Multivariable Calculus](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/) y [MIT Linear Algebra](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/).

## Pendiente

- Evaluar comprensión pedagógica con usuarios reales.
- Agregar vistas WebGL sólo si aportan manipulación tridimensional que Canvas 2D no pueda ofrecer.
- Nunca ejecutar un despliegue sin una instrucción explícita.


## V0.3 · rendimiento, familias y refinamiento visual

- **Render bajo demanda:** las ocho escenas estáticas no consumen `requestAnimationFrame` de forma continua. Solo el Atlas se anima; el render se pausa cuando se cambia de pestaña o sale del viewport.
- **DPR adaptativo:** calidad del Canvas reducida suavemente en pantallas densas; menores capas generativas en pantallas angostas.
- **Funciones:** familias polinómica, sinusoidal, exponencial, logarítmica y racional, con fórmulas, derivadas analíticas, dominios y desafíos propios. Asíntotas y discontinuidades se separan en el dibujo.
- **Diseño:** controles segmentados, foco accesible, jerarquía editorial, detalles en tarjetas y marco del laboratorio, sin nuevas dependencias.
- **Verificación:** `npm test`, `tsc --project tsconfig.mathcheck.json`. El build de React requiere instalar las dependencias de `package.json`.

## V0.4 · Ejemplos reales y Atlas por separado (en PR de revisión)

El recorrido inicial abre **Funciones**, no una fusión de curvas. Desde **Atlas generativo** pueden seleccionarse individualmente Lissajous, Lorenz o Gielis. La animación está limitada a 20 FPS, y Lorenz se calcula sólo si se selecciona.

El capítulo **Integrales dobles** permite comparar **cilindro, esfera completa, hemisferio, paraboloide, cono y superficie cuadrática**. Cada caso incluye fórmula, dominio, gráfica, aproximación y valor exacto. El resto de los capítulos también incorpora ejemplos específicos de funciones, límites, derivadas, integrales, matrices, EDO y gradientes. Los detalles de las ecuaciones y limitaciones están en [`docs/ADVANCED_LAB.md`](docs/ADVANCED_LAB.md).

Comandos de validación:

```bash
npm test
npx tsc --project tsconfig.mathcheck.json
npm run build
```

La compilación React/Vite depende de instalar las dependencias de npm y aún no está validada en este entorno; verificar en Vercel antes del merge.
