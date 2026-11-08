# Laboratorio avanzado — Alcance y validación

## Enfoque

Todos los módulos usan una sola definición matemática para la visualización, los valores calculados y los desafíos. La estética generativa (Lorenz / Lissajous / Gielis) funciona como exploración creativa; no debe confundirse con resultados geográficos ni métricas reales.

## Integral doble

Superficie: `f(x,y)=1+a(x²+y²)` con `a≥0` y `R=[−b,b]×[−b,b]`, `b>0`.

Integral exacta:

`∬_R f(x,y)dA = ∫_{−b}^b∫_{−b}^b [1+a(x²+y²)]dy dx = 4b² + (8/3)ab⁴`.

Aproximación con puntos medios: para `n×n` celdas, `Δ=2b/n`, `x_i=-b+(i+1/2)Δ`, `y_j=-b+(j+1/2)Δ`.

`I_n = Σᵢ Σⱼ f(x_i,y_j)Δ²`.

La vista 2.5D dibuja la superficie y proyecta verticales para recordar la aproximación. No dibuja prismas volumétricos completos: la suma numérica es correcta pero la visualización volumétrica detallada sigue siendo una mejora futura.

## Ecuación diferencial ordinaria

Problema: `dy/dt = k y`, `y(0)=y0`.

Solución analítica: `y(t)=y0·exp(k t)`.

Euler explícito: `y_{j+1}=y_j + h·k·y_j`, con último paso recortado hasta `t=4`.

Los puntos naranja provienen del cálculo de Euler; la curva celeste de la solución exacta. La diferencia final se calcula al mismo instante para ambas series.

## Derivadas parciales y gradiente

Función: `f(x,y)=a x² + b y²`, con `a,b>0`.

`∂f/∂x = 2ax`, `∂f/∂y=2by`, `∇f=(2ax,2by)`.

El vector violeta proyectado sobre el plano representa la dirección del gradiente. La altura corresponde a la función elegida, no a una variable geográfica real.

## Corrección, pruebas y límites de la interfaz

- `tests/advanced.test.mjs` valida convergencia de cuadraturas, solución de Euler, gradiente y geometría generativa finita.
- `tsconfig.mathcheck.json` verifica sin dependencias externas los módulos `math.ts`, `measure.ts`, `content.ts` y `visuals.ts`.
- La validación **completa** de React/Vite requiere `npm install`, `npm run build` y pruebas de interacción en un navegador real. No declarar esa validación como superada hasta ejecutarla.
- La interfaz usa Canvas 2D y proyección, no WebGL. Rotar el modelo modifica sólo la perspectiva, nunca los datos.
- No hay IA generativa ni persistencia del progreso todavía; los capítulos resueltos duran solamente la sesión del navegador.

## V0.4 · Galería de ejemplos con fórmulas y dominios

Los ejemplos son seleccionables, independientes y muestran la **misma función en el gráfico y en el cálculo**. La entrada predeterminada es el capítulo de funciones; el Atlas tiene tres escenas independientes (Lissajous, Lorenz y Gielis), con Lorenz calculado solamente bajo demanda, tope de 20 cuadros/s, pausa por visibilidad y DPR limitado.

### Integrales dobles (dominios y volúmenes)

La integral doble para el volumen de un sólido vertical usa `V=∬_D (z_superior-z_inferior) dA`. En los casos circulares, `D={x²+y²≤R²}` y se usa la sustitución polar `dA=r dr dθ` para las sumas de Riemann con puntos medios. El caso cuadrático utiliza un cuadrado y puntos medios cartesianos.

| Modelo | Integrando (espesor vertical) | Resultado exacto |
|---|---|---|
| Cilindro | `H` sobre disco | `πR²H` |
| Esfera completa | `2√(R²−x²−y²)` sobre disco | `4πR³/3` |
| Hemisferio superior | `√(R²−x²−y²)` sobre disco | `2πR³/3` |
| Paraboloide | `H(1−(x²+y²)/R²)` sobre disco | `πR²H/2` |
| Cono | `H(1−√(x²+y²)/R)` sobre disco | `πR²H/3` |
| Cuadrática | `1+a(x²+y²)` sobre `[-b,b]²` | `4b²+(8/3)ab⁴` |

**Nota:** para la esfera completa, el gráfico muestra las dos hojas `z=±√(R²−x²−y²)` y la integral calcula la diferencia entre ambas. No se presenta erróneamente media esfera como esfera completa.

### Familias en otras escenas

- Límites: `sen(x)/x`, discontinuidad removible en `(x²−1)/(x−1)` y salto.
- Derivadas: `x²`, `sen(x)`, `eˣ`; pendiente secante y pendiente analítica.
- Integrales simples: `x²/4+1/2`, `1+sen(x)`, `1+x/2`; suma izquierda y primitiva exacta.
- Matrices: identidad, cizalla, rotación 90°, proyección singular.
- Ecuaciones diferenciales: exponencial y logística; Euler frente a soluciones exactas.
- Gradientes: paraboloide, silla de montar y gaussiana (gradientes analíticos).

### Rendimiento y límites de verificación

El Atlas no mezcla tres renderizados. Se inicia en funciones, y cada modo se dibuja por separado. La trayectoria de Lorenz se genera de forma diferida y se reutiliza en memoria. Las escenas no animadas se redibujan solo ante cambios. Las mallas están limitadas para equipos modestos. No se agregaron dependencias.

Las pruebas automatizadas cubren valores exactos, convergencia numérica y dominios. La sintaxis TSX y el motor matemático se validaron por separado; una compilación React/Vite con dependencias instaladas debe ejecutarse en CI/Vercel antes de fusionar.
