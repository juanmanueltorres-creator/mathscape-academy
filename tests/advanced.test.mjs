import test from 'node:test';
import assert from 'node:assert/strict';
import {exactDoubleIntegral,midpointDoubleIntegral,surface,odeExact,solveEuler,surfaceGradient,superRadius,lorenzPoints,determinant,applyMatrix} from '../src/math.ts';
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`Expected ${a} ≈ ${b}`);
test('integral doble de constante equivale al área de la región',()=>{
  for(const b of [.5,1,1.5])for(const n of [2,7,20])close(midpointDoubleIntegral(0,b,n),4*b*b);
});
test('integral doble de cuadrática converge al valor exacto',()=>{
 const e=exactDoubleIntegral(.6,1),a=midpointDoubleIntegral(.6,1,8),b=midpointDoubleIntegral(.6,1,20);
 assert.ok(Math.abs(b-e)<Math.abs(a-e));assert.ok(Math.abs(b-e)<.01);
});
test('integrando y dominio definidos correctamente',()=>{
 close(surface(1,0,.4),1.4);close(surface(1,1,.4),1.8);close(exactDoubleIntegral(0,1),4);
});
test('Euler con k=0 coincide con solución exacta',()=>{
 const pts=solveEuler(0,2.5,4,.3);close(pts.at(-1).y,2.5);close(odeExact(0,2.5,4),2.5);
});
test('Euler converge para tasa de decaimiento al achicar paso',()=>{
 const exact=odeExact(-.6,2,4);
 const a=solveEuler(-.6,2,4,.4).at(-1).y,b=solveEuler(-.6,2,4,.05).at(-1).y;
 assert.ok(Math.abs(b-exact)<Math.abs(a-exact));
});
test('gradiente de paraboloide es nulo en el origen',()=>{
 assert.deepEqual(surfaceGradient(1.4,.5,0,0),[0,0]);assert.deepEqual(surfaceGradient(1,.5,2,-3),[4,-3]);
});
test('matriz singular colapsa área',()=>{
 close(determinant([1,1,1,1]),0);assert.deepEqual(applyMatrix([1,1,1,1],[1,-1]),[0,0]);
});
test('órbitas generativas son finitas',()=>{
 assert.ok(Number.isFinite(superRadius(Math.PI/4,6,1.25)));
 const pts=lorenzPoints(400);assert.ok(pts.length>100);assert.ok(pts.every(p=>p.every(Number.isFinite)));
});
test('valores inválidos arrojan error',()=>{
 assert.throws(()=>midpointDoubleIntegral(.5,1,0),RangeError);
 assert.throws(()=>solveEuler(.2,2,4,0),RangeError);
});
