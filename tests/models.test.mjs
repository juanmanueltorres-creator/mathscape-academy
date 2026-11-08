import test from 'node:test';
import assert from 'node:assert/strict';
import {
  exactSolidVolume,midpointSolidVolume,solidHeight,derivativeExample,
  derivativeExampleSlope,secantExample,integrandExample,exactIntegralExample,
  leftRiemannExample,limitExample,limitLeftRight,odeModelExact,solveEulerModel,
  gradientExample,gradientExampleValue
} from '../src/math.ts';
const close=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<=tol,`${a} ≈ ${b}, tol=${tol}`);

test('cilindro: altura constante, disco y volumen πR²H',()=>{
 close(solidHeight(1,0.2,.4,2,3,0),3);
 close(exactSolidVolume(1,2,3,0),12*Math.PI);
 close(midpointSolidVolume(1,2,3,0,8),12*Math.PI);
 assert.ok(Number.isNaN(solidHeight(1,3,0,2,3,0)));
});
test('esfera completa: espesor sobre disco y volumen 4πR³/3',()=>{
 close(solidHeight(5,0,0,2,1,0),4);
 close(solidHeight(5,2,0,2,1,0),0);
 close(exactSolidVolume(5,2,1,0),32*Math.PI/3);
 const exact=exactSolidVolume(5,1,1,0);
 assert.ok(Math.abs(midpointSolidVolume(5,1,1,0,24)-exact)<Math.abs(midpointSolidVolume(5,1,1,0,6)-exact));
});
test('hemisferio: volumen 2πR³/3 y convergencia',()=>{
 close(solidHeight(2,0,0,2,4,0),2);
 close(solidHeight(2,2,0,2,4,0),0);
 close(exactSolidVolume(2,2,4,0),16*Math.PI/3);
 const exact=exactSolidVolume(2,1,2,0);
 assert.ok(Math.abs(midpointSolidVolume(2,1,2,0,24)-exact)<Math.abs(midpointSolidVolume(2,1,2,0,6)-exact));
});
test('paraboloide y cono: fórmulas de volumen y convergencia',()=>{
 for(const model of [3,4]){
  const exact=exactSolidVolume(model,1.5,2.3,0);
  const coarse=midpointSolidVolume(model,1.5,2.3,0,4);
  const fine=midpointSolidVolume(model,1.5,2.3,0,24);
  assert.ok(Math.abs(fine-exact)<Math.abs(coarse-exact));
 }
 close(exactSolidVolume(3,1,2,0),Math.PI);
 close(exactSolidVolume(4,1,3,0),Math.PI);
});
test('superficie original se conserva en el cuadrado',()=>{
 close(exactSolidVolume(0,1,2,.5),4+4/3);
 close(midpointSolidVolume(0,1,2,.5,50),exactSolidVolume(0,1,2,.5),.0006);
});
test('derivadas: ejemplos analíticos y secantes convergentes',()=>{
 close(derivativeExampleSlope(1,0),1);
 close(derivativeExampleSlope(2,0),1);
 close(derivativeExample(0,3),9);
 for(const model of [0,1,2])close(secantExample(model,.7,.00001),derivativeExampleSlope(model,.7),.00003);
});
test('integrales simples: exacto y suma izquierda para distintos ejemplos',()=>{
 for(const model of [0,1,2]){
  const upper=2.4;
  const exact=exactIntegralExample(model,0,upper);
  close(leftRiemannExample(model,0,upper,2000),exact,.005);
  assert.ok(integrandExample(model,1)>=0);
 }
});
test('límites lateral y discontinuidad de salto',()=>{
 close(limitExample(1,1.3),2.3);assert.ok(Number.isNaN(limitExample(1,1)));
 close(limitLeftRight(0,.01)[0],limitLeftRight(0,.01)[1]);
 assert.deepEqual(limitLeftRight(2,.1),[-1,1]);
});
test('Euler logístico se acerca a la solución exacta al refinar',()=>{
 const exact=odeModelExact(1,1,1,4,5);
 const a=solveEulerModel(1,1,1,4,.4,5).at(-1).y;
 const b=solveEulerModel(1,1,1,4,.05,5).at(-1).y;
 assert.ok(Math.abs(exact-b)<Math.abs(exact-a));
 close(odeModelExact(1,0,2,4,5),2);
});
test('gradientes de silla y campana gaussianas',()=>{
 assert.deepEqual(gradientExample(1,2,3,1,-2),[4,12]);
 close(gradientExampleValue(2,2,.5,0,0),2);
 gradientExample(2,2,.5,0,0).forEach(v=>close(v,0));
});
test('restricciones de dominio para sólidos y Euler',()=>{
 assert.throws(()=>exactSolidVolume(1,-1,2,0),RangeError);
 assert.throws(()=>midpointSolidVolume(3,1,1,0,0),RangeError);
 assert.throws(()=>solveEulerModel(1,1,1,4,0,3),RangeError);
});
