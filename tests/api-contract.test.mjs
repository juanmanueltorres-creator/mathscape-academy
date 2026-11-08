import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTRACT_CASES,contractById,presetBody,evaluateContract} from '../src/api-contract.ts';
const request=(id,payload)=>evaluateContract(id,JSON.stringify(payload));
test('tres contratos independientes: territorio, contenidos, finanzas',()=>{
 assert.deepEqual(CONTRACT_CASES.map(x=>x.id),['terrain','social','bank']);
 assert.equal(contractById('bank').endpoint,'POST /transferencias');
 assert.throws(()=>contractById('nonexistent'),RangeError);
});
test('un POST válido devuelve 202 para procesos diferidos y 201 para publicación',()=>{
 assert.deepEqual(CONTRACT_CASES.map(x=>evaluateContract(x.id,presetBody(x.id,'valid')).status),[202,201,202]);
 for(const c of CONTRACT_CASES){
  const r=evaluateContract(c.id,presetBody(c.id,'valid'));
  assert.equal(r.ok,true);
  assert.ok(typeof r.message==='string'&&r.message.length>6);
  assert.equal(r.responseJson,JSON.stringify(r.body,null,2));
 }
});
test('JSON sintácticamente roto causa 400, no 422',()=>{
 for(const c of CONTRACT_CASES){
  const r=evaluateContract(c.id,presetBody(c.id,'syntax'));
  assert.equal(r.status,400);assert.equal(r.phase,'syntax');assert.equal(r.ok,false);
 }
});
test('faltan campos requeridos → 422 en fase de estructura',()=>{
 for(const c of CONTRACT_CASES){
  const r=evaluateContract(c.id,presetBody(c.id,'missing'));
  assert.equal(r.status,422);assert.equal(r.phase,'structure');
  assert.ok(r.message.includes(c.missingKey));
 }
});
test('campos presentes pero valores imposibles → 422 en reglas',()=>{
 for(const c of CONTRACT_CASES){
  const r=evaluateContract(c.id,presetBody(c.id,'invalid'));
  assert.equal(r.status,422);assert.equal(r.phase,'rule');
 }
});
test('un array, nulo o string válido JSON no es el objeto esperado',()=>{
 for(const value of [[],null,'texto',32]){
  const r=request('social',value);
  assert.equal(r.status,422);assert.equal(r.phase,'structure');
 }
});
test('propiedades desconocidas se rechazan por contrato explícito',()=>{
 const body={...contractById('social').initial,privilegio:'administrador'};
 const r=request('social',body);assert.equal(r.status,422);assert.equal(r.phase,'structure');
 assert.ok(r.message.includes('privilegio'));
});
test('payload excesivo se rechaza antes de parsear',()=>{
 const r=evaluateContract('bank','a'.repeat(4001));assert.equal(r.status,400);
});
test('bbox requiere grados válidos, orden y un área limitada',()=>{
 const c=contractById('terrain').initial;
 for(const bbox of [[-69.1,-31.5,-69.2,-31.4],[-69.2,-91,-69.1,-31.4],[-69,-40,-61,-30],[-69,-31,-68],[-69,-31,'-68',-30]]){
  assert.equal(request('terrain',{...c,bbox}).status,422);
 }
 assert.equal(request('terrain',{...c,crs:'EPSG:3857'}).status,422);
 assert.equal(request('terrain',{...c,resolucion_m:3}).status,422);
 assert.equal(request('terrain',{...c,resolucion_m:250}).status,202);
});
test('transferencia valida monto, moneda e idempotencia sin mover dinero',()=>{
 const c=contractById('bank').initial;
 for(const variant of [{monto:999},{monto:'200'},{monto:0},{moneda:'USD'},{clave_idempotencia:''},{destino:'otro'}]){
  const r=request('bank',{...c,...variant});assert.equal(r.status,422);assert.equal(r.ok,false);
 }
 const valid=request('bank',c);assert.equal(valid.status,202);
 assert.equal(valid.body.estado,'pendiente');assert.equal(valid.body.duplicados,0);
});
test('publicación valida el tipo de texto, los MB y la privacidad',()=>{
 const c=contractById('social').initial;
 for(const variant of [{titulo:' '},{titulo:1},{archivo_mb:16},{archivo_mb:0},{visibilidad:'todos'}]){
  assert.equal(request('social',{...c,...variant}).status,422);
 }
 assert.equal(request('social',{...c,visibilidad:'publica'}).status,201);
});
test('la corrección del mismo JSON cambia la respuesta de fallo a éxito',()=>{
 const rejected=evaluateContract('terrain',presetBody('terrain','missing'));
 const accepted=evaluateContract('terrain',presetBody('terrain','valid'));
 assert.equal(rejected.ok,false);assert.equal(accepted.ok,true);
 assert.notEqual(rejected.status,accepted.status);
});
