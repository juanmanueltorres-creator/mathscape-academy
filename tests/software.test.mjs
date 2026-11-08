import test from 'node:test';
import assert from 'node:assert/strict';
import {PRODUCTS,productByIndex,simulateSoftware,modelDecision} from '../src/software.ts';
import {calculateSoftware} from '../src/software-measure.ts';
test('tres relatos con seis etapas y criterio de producto propio',()=>{
 assert.equal(PRODUCTS.length,3);
 for(const item of PRODUCTS){
  assert.equal(item.nodes.length,6);
  assert.ok(item.need.length>12&&item.metric.length>18);
  assert.ok(new Set(item.nodes.map(x=>x.layer)).size>=5);
  assert.ok(item.tradeoff.length>15);
 }
});
test('primer clic correcto: rutas=200, publicación=201, transferencia=202 pendiente',()=>{
 const codes=PRODUCTS.map((_,index)=>simulateSoftware(index,0).status);
 assert.deepEqual(codes,[200,201,202]);
 assert.equal(simulateSoftware(2,0).state,'pending');
});
test('datos inválidos nunca informan éxito ni movimiento de dinero',()=>{
 for(let i=0;i<PRODUCTS.length;i++){
  const r=simulateSoftware(i,1);
  assert.equal(r.state,'rejected');
  assert.equal(r.changed,false);
 }
 assert.equal(simulateSoftware(1,1).status,413);
 assert.equal(simulateSoftware(2,1).status,422);
});
test('transferencia repetida: misma clave, mismo identificador, segundo débito cero',()=>{
 const first=simulateSoftware(2,0);
 const retry=simulateSoftware(2,2);
 assert.equal(first.status,202);
 assert.equal(retry.status,200);
 assert.ok(first.response.includes('op-123')&&retry.response.includes('op-123'));
 assert.equal(retry.changed,false);
 assert.equal(retry.idempotent,true);
 assert.ok(retry.message.includes('Sin segundo débito'));
});
test('reintentar publicación recupera estado sin duplicar operación',()=>{
 const r=simulateSoftware(1,2);
 assert.equal(r.status,200);
 assert.equal(r.changed,false);
 assert.equal(r.idempotent,true);
 assert.ok(r.request.startsWith('GET'));
});
test('repetir GET de rutas no promete caché ni la misma respuesta',()=>{
 const r=simulateSoftware(0,2);
 assert.equal(r.status,200);assert.equal(r.changed,true);assert.equal(r.idempotent,false);
});
test('interfaz conserva caso y métricas con cambios de modo',()=>{
 const original=modelDecision(1,0),error=modelDecision(1,1);
 assert.equal(original.p.name,error.p.name);
 assert.equal(original.nodes.length,error.nodes.length);
 assert.notEqual(original.outcome.status,error.outcome.status);
});
test('índices de producto fuera del rango no rompen navegación',()=>{
 assert.equal(productByIndex(-12).id,'maps');
 assert.equal(productByIndex(999).id,'bank');
 assert.throws(()=>productByIndex(NaN),RangeError);
});

test('el microdesafío exige rechazo sin mutación, no un clic de éxito',()=>{
 for(let i=0;i<PRODUCTS.length;i++){
  assert.equal(calculateSoftware('software',{softwareProduct:i,softwareMode:0,softwareStep:0}).passed,false);
  assert.equal(calculateSoftware('software',{softwareProduct:i,softwareMode:2,softwareStep:0}).passed,false);
  assert.equal(calculateSoftware('software',{softwareProduct:i,softwareMode:1,softwareStep:0}).passed,true);
 }
});
test('el capítulo de producto no se completa sin recorrer las seis etapas',()=>{
 assert.equal(calculateSoftware('product',{softwareProduct:0,softwareStep:0}).passed,false);
 assert.equal(calculateSoftware('product',{softwareProduct:0,softwareStep:5}).passed,true);
});
