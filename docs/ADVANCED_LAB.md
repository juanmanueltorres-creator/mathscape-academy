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
