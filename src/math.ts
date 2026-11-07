/** Funciones puras: misma matemática para visualización, explicación y pruebas. */
export type Vec2 = readonly [number, number];
export type Mat2 = readonly [number, number, number, number];
export const quadratic = (x: number) => x * x;
export const derivativeQuadratic = (x: number) => 2 * x;
export const secantQuadratic = (x: number, h: number) => {
  if (h === 0) throw new RangeError('h debe ser distinto de cero');
  return (quadratic(x + h) - quadratic(x)) / h;
};
export const integrand = (x: number) => x * x / 4 + 0.5;
export const exactIntegral = (a: number, b: number) => (b ** 3 - a ** 3) / 12 + (b - a) / 2;
export function leftRiemann(a: number, b: number, n: number): number {
  if (!Number.isInteger(n) || n <= 0) throw new RangeError('n debe ser entero positivo');
  const dx = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += integrand(a + i * dx) * dx;
  return sum;
}
export const determinant = ([a,b,c,d]: Mat2) => a * d - b * c;
export const applyMatrix = ([a,b,c,d]: Mat2, [x,y]: Vec2): Vec2 => [a*x + b*y,c*x + d*y];
