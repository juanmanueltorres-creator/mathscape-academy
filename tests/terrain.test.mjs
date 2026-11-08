import test from 'node:test';
import assert from 'node:assert/strict';
import {TERRAIN_EXTENT_M,integrateElevationField,terrainGradient,terrainElevation,terrainReport} from '../src/terrain.ts';
const close=(a,b,tol=1e-6)=>assert.ok(Math.abs(a-b)<=tol,`Expected ${a} ≈ ${b}`);
test('dimensiones geoespaciales en metros y volumen en m³',()=>{
 const r=integrateElevationField(()=>1200,20,1100);
 close(r.above,100_000_000,.001);close(r.below,0);close(r.net,r.above);close(r.cellSize,50);assert.equal(r.cells,400);
});
test('integral de volumen con corte y relleno',()=>{
 const r=integrateElevationField((x)=>x>=0?1200:1000,20,1100);
 close(r.above,50_000_000,.001);close(r.below,50_000_000,.001);close(r.net,0,.001);
});
test('gradiente discreto aproxima correctamente una ladera plana',()=>{
 const slope=terrainGradient((x,y)=>1000+.12*x-.05*y,100,-75,25);
 close(slope[0],.12);close(slope[1],-.05);close(Math.atan(Math.hypot(...slope))*180/Math.PI,7.4069121,1e-4);
});
test('paisajes deterministas con valores finitos',()=>{
 for(let m=0;m<3;m++)for(let x=-500;x<=500;x+=125)for(let y=-500;y<=500;y+=125){
  const z=terrainElevation(x,y,m,.7);assert.ok(Number.isFinite(z));close(z,terrainElevation(x,y,m,.7));
 }
});
test('modelo irregular separa parámetros de representación de posición',()=>{
 const p={landform:0,irregularity:.6,gridN:22,datum:1100,pickX:100,pickY:100};
 const a=terrainReport(p),b=terrainReport({...p,pickX:-200,pickY:300});
 close(a.coarse.above,b.coarse.above,.001);assert.notEqual(a.z,b.z);
 assert.ok(a.slopePercent>=0&&a.slopeDegrees>=0);assert.equal(a.coarse.cells,22*22);
});
test('malla fina aproxima referencia numérica mejor que malla gruesa para relieve suave',()=>{
 const p={landform:0,irregularity:0,datum:1100,pickX:0,pickY:0};
 const a=terrainReport({...p,gridN:8}),b=terrainReport({...p,gridN:48});
 assert.ok(b.samplingDifferencePercent<a.samplingDifferencePercent);
});
test('rechazar resolución o paso inválidos',()=>{
 assert.throws(()=>integrateElevationField(()=>1200,1,1100),RangeError);
 assert.throws(()=>integrateElevationField(()=>NaN,12,1100),RangeError);
 assert.throws(()=>terrainGradient(()=>1,0,0,0),RangeError);
});
