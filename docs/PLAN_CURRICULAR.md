# Mathscape Academy · Plan curricular de trabajo

**Propósito:** enseñar matemáticas mediante experimentación, predicción, manipulación y evaluación breve. Este archivo expresa una propuesta de diseño educativo y NO reemplaza programas oficiales.

## Principios didácticos

Cada escena sigue la secuencia: (1) observar, (2) anticipar, (3) experimentar, (4) formalizar y (5) resolver un desafío verificable.

- Los gráficos y resultados deben surgir de la misma función matemática.
- Ofrecer repaso contextual, sin exigir completar decenas de lecciones elementales.
- Priorizar derivadas, integrales, matrices y cálculo multivariable.
- Evitar el 3D si una representación bidimensional permite explicar mejor.
- Animaciones pausable, controles accesibles y explicaciones cortas.
- Los valores mostrados en una simulación no constituyen por sí mismos evidencia de aprendizaje.

## Secuencia por etapas

| Etapa | Contenido | Ejemplo interactivo | Criterio de dominio |
| --- | --- | --- | --- |
| 0 | Álgebra y funciones | Pendiente, ordenada y transformaciones | Predecir cambio de la recta |
| 1 | Límites y continuidad | Aproximación lateral, agujeros, saltos | Distinguir límite de valor |
| 2 | Derivadas: concepto | Secante a tangente | Explicar el límite del cociente incremental |
| 3 | Derivadas: técnicas | Producto, cociente y cadena | Elegir reglas y verificar resultados |
| 4 | Aplicaciones de derivadas | Extremos, optimización, velocidad y aceleración | Identificar tasa de cambio y justificar soluciones |
| 5 | Integrales: concepto | Sumas de Riemann izquierda, derecha y punto medio | Predecir error y convergencia |
| 6 | Teorema fundamental | Acumulación, función primitiva | Vincular pendiente y área acumulada |
| 7 | Técnicas integrales | Sustitución, partes, integrales impropias | Justificar método y condiciones |
| 8 | Vectores y matrices | Matrices 2×2, determinantes y transformaciones | Resolver sistemas y detectar singularidad |
| 9 | Álgebra lineal avanzada | Espacios, autovalores, bases y proyecciones | Interpretar cambios de base |
| 10 | Multivariable | Superficies, gradientes, jacobianos y niveles | Calcular cambios y describir dirección de máximo crecimiento |
| 11 | Aplicaciones científicas | Movimiento, optimización territorial, simulaciones | Resolver un problema modelado y explicar limitaciones |

## V0.1: cuatro escenas implementadas

### Función lineal
- Modificar m y b.
- Comparar forma algebraica y gráfica.
- Desafío: pendiente 2 y ordenada −1.

### Derivada
- Función f(x)=x².
- Secante: (f(x₀+h)−f(x₀))/h, con h distinto de cero.
- Tangente: f′(x₀)=2x₀.
- Desafío: error entre pendientes menor a 0,11.

### Integral
- Función f(x)=x²/4 + 1/2, positiva y creciente en el intervalo estudiado.
- Aprox.: suma izquierda de n rectángulos, integral exacta por primitiva.
- Desafío: error absoluto menor a 0,06.

### Matriz
- A es 2×2. Vectores y grilla transformados con A.
- Det(A)=ad−bc; |det(A)| representa factor de área.
- Desafío: conseguir det(A)=0.

## A desarrollar

1. Añadir anticipación escrita o elección de hipótesis antes de manipular cada escena.
2. Límites laterales, continuidad y definición formal de derivada.
3. Derivación de funciones más diversas, regla de la cadena y optimización.
4. Integral como acumulación y conexión con el teorema fundamental.
5. Matrices, sistemas de ecuaciones, composición y cambios de base.
6. Pruebas de usabilidad y aprendizaje con usuarios; corrección de conceptos confusos.

## Referencias curriculares

- [Argentina — Núcleos de Aprendizajes Prioritarios](https://www.argentina.gob.ar/nucleos-de-aprendizaje-prioritarios)
- [FaMAF, UNC — Análisis Matemático I](https://www.famaf.unc.edu.ar/academica/materias/analisis-matematico-i/)
- [MIT — Single Variable Calculus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/)
- [MIT — Linear Algebra](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/)
- [OpenStax — Cálculo, volumen 1](https://openstax.org/books/c%C3%A1lculo-volumen-1/pages/prefacio)

**No agregar IA adaptativa ni Blender antes de validar el ciclo de aprendizaje.**
