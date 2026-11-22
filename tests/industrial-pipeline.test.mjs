import test from 'node:test';
import assert from 'node:assert/strict';
import {technicalStages,commercialStages,industrialCases,systemState,stageDetail} from '../src/industrial-pipeline.ts';

test('hay tres casos didácticos y cada etapa tiene contenido concreto',()=>{
 assert.equal(Object.keys(industrialCases).length,3);
 assert.equal(technicalStages.length,7);
 assert.equal(commercialStages.length,6);
 for(const id of Object.keys(industrialCases)){
  for(const stage of technicalStages){
   assert.ok(stageDetail(id,stage.id).length>20, `${id}: ${stage.id}`);
  }
  assert.ok(industrialCases[id].caution.length>20);
 }
});

test('con electricidad y conectividad, enviar no implica validar',()=>{
 const s=systemState('online','available');
 assert.equal(s.id,'connected');
 assert.equal(s.local,true);
 assert.equal(s.remote,true);
 assert.match(s.detail,/no prueba precisión/i);
});

test('sin cobertura hay almacenamiento local condicional, sin telemetría remota',()=>{
 const s=systemState('offline','available');
 assert.equal(s.id,'buffering');
 assert.equal(s.local,true);
 assert.equal(s.remote,false);
 assert.match(s.detail,/suponiendo almacenamiento local/i);
});

test('sin alimentación no se puede medir aunque exista red',()=>{
 for(const link of ['online','offline']){
  const s=systemState(link,'failed');
  assert.equal(s.id,'stopped');
  assert.equal(s.local,false);
  assert.equal(s.remote,false);
 }
});

test('los ejemplos separan detección y control, documentación y sensor',()=>{
 assert.match(industrialCases.pipeline.decision,/no significa controlar/i);
 assert.match(industrialCases.network.sensor,/no toda fuente es un sensor/i);
 assert.match(industrialCases.core.caution,/no representa la arquitectura/i);
});
