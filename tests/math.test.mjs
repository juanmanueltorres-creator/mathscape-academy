// Ejecutar con Node 22+: npm test. No requiere React ni Vite.
import test from 'node:test';
import assert from 'node:assert/strict';
import {quadratic,derivativeQuadratic,secantQuadratic,exactIntegral,leftRiemann,determinant,applyMatrix} from '../src/math.ts';
test('la pendiente de la secante converge a la derivada',()=>{
 assert.equal(quadratic(2),4);
 assert.equal(derivativeQuadratic(2),4);
 assert.ok(Math.abs(secantQuadratic(2,.01)-4)<.011);
 assert.throws(()=>secantQuadratic(2,0));
});
test('la suma de Riemann converge al valor exacto',()=>{
 const truth=exactIntegral(0,2);
 assert.ok(Math.abs(truth-5/3)<1e-10);
 assert.ok(Math.abs(leftRiemann(0,2,100)-truth)<Math.abs(leftRiemann(0,2,10)-truth));
 assert.throws(()=>leftRiemann(0,2,0));
});
test('las matrices transforman puntos y el determinante define área',()=>{
 assert.deepEqual(applyMatrix([1,2,3,4],[2,1]),[4,10]);
 assert.equal(determinant([1,2,2,4]),0);
 assert.equal(determinant([2,0,0,3]),6);
});
