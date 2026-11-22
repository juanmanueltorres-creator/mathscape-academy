import test from 'node:test';
import assert from 'node:assert/strict';
import {evidenceLevels,officialIndicators,observations,qualityDemo,samplingDemo,cpiToyDemo,purchasingPower}
 from '../src/data-indicators.ts';

test('cuatro niveles de datos, sin confundir plataformas con población',()=>{
 assert.equal(evidenceLevels.length,4);
 assert.match(evidenceLevels[3].risk,/no implica representar/);
});

test('faltantes no se reemplazan silenciosamente por cero',()=>{
 assert.deepEqual(observations,[10,12,null,16,20]);
 const correct=qualityDemo(false,false);
 const incorrect=qualityDemo(true,false);
 assert.equal(correct.missing,1);
 assert.equal(correct.value,14.5);
 assert.equal(incorrect.value,11.6);
 assert.equal(correct.reference,14.5);
 assert.ok(incorrect.value<correct.value);
});

test('registrar una fila duplicada cambia artificialmente el promedio',()=>{
 const duplicated=qualityDemo(false,true);
 assert.equal(duplicated.duplicates,1);
 assert.equal(duplicated.used,5);
 assert.equal(duplicated.rows,6);
 assert.equal(duplicated.value,15.6);
});

test('ejemplo muestral separa proporción de población y muestra',()=>{
 const unbiased=samplingDemo(30);
 assert.equal(unbiased.population,35);
 assert.equal(unbiased.naiveSample,35);
 assert.equal(unbiased.gap,0);
 const biased=samplingDemo(70);
 assert.equal(biased.population,35);
 assert.equal(biased.naiveSample,55);
 assert.equal(biased.gap,20);
});

test('pesos suman cien y alteran la media sin cambiar cambios de precios',()=>{
 const a=cpiToyDemo(20), b=cpiToyDemo(40);
 assert.equal(a.food+a.housing+a.transport,100);
 assert.equal(b.food+b.housing+b.transport,100);
 assert.deepEqual(a.changes,b.changes);
 assert.equal(a.index,12.5);
 assert.equal(b.index,16.875);
 assert.ok(b.index>a.index);
});

test('cambio real compara multiplicativamente salario con precios',()=>{
 assert.ok(Math.abs(purchasingPower(20,30)-(-7.692307692307686))<1e-7);
 assert.equal(purchasingPower(30,30),0);
 assert.equal(purchasingPower(0,0),0);
 assert.throws(()=>purchasingPower(10,-100),/> -100/);
});

test('fuentes estatales incluyen IPC, ingresos, pobreza y empleo sin cifras inventadas',()=>{
 assert.equal(officialIndicators.length,4);
 assert.deepEqual(officialIndicators.map(i=>i.key),['ipc','wages','poverty','jobs']);
 for(const i of officialIndicators){
  assert.match(i.url,/^https:\/\/www\.indec\.gob\.ar\//);
  assert.ok(i.what.length>40);
  assert.ok(i.caution.length>45);
 }
 assert.match(officialIndicators.find(i=>i.key==='jobs').how,/PEA/);
});
