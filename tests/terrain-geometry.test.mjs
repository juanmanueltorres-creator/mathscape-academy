import test from 'node:test';
import assert from 'node:assert/strict';
import {terrainContours,terrainMeshSamples,terrainField} from '../src/terrain-geometry.ts';
import {terrainElevation} from '../src/terrain.ts';
const close=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,'expected '+a+' ≈ '+b);
test('curvas de nivel de un plano x constante respetan la cota y recorren el campo',()=>{
 const line=terrainContours((x)=>x,20,[17.3])[0];
 assert.ok(line.segments.length>=15);
 let length=0;
 for(const [a,b] of line.segments){
  close(a[0],17.3);close(b[0],17.3);
  length+=Math.hypot(b[0]-a[0],b[1]-a[1]);
 }
 close(length,1000,.0001);
});
test('campo constante no genera curvas fantasma',()=>{
 const lines=terrainContours(()=>1000,12,[1000,1050,950]);
 assert.ok(lines.every(x=>x.segments.length===0));
});
test('curvas de terreno irregular son finitas y muestreadas desde mismo campo',()=>{
 const model=terrainField(1,.8);
 const lines=terrainContours(model,22,[980,1010,1050,1110]);
 assert.ok(lines.some(x=>x.segments.length>0));
 for(const line of lines)for(const [a,b] of line.segments){
  assert.ok([...a,...b].every(Number.isFinite));
  // Linear interpolation agrees with contour height to within expected raster error.
  assert.ok(Math.abs(model(a[0],a[1])-line.level)<25);
 }
});
test('malla 3D usa exactamente mismas alturas y mantiene normales orientadas hacia arriba',()=>{
 const m=terrainMeshSamples(2,.6,16);
 assert.equal(m.vertices,289);assert.equal(m.triangles,512);
 assert.equal(m.positions.length,867);assert.equal(m.faces.length,1536);
 for(let i=0;i<m.positions.length;i+=3)close(m.positions[i+2],terrainElevation(m.positions[i],m.positions[i+1],2,.6),1e-10);
 const ia=m.faces[0],ib=m.faces[1],ic=m.faces[2];
 const a=m.positions.slice(ia*3,ia*3+3),b=m.positions.slice(ib*3,ib*3+3),c=m.positions.slice(ic*3,ic*3+3);
 const ab=[b[0]-a[0],b[1]-a[1]],ac=[c[0]-a[0],c[1]-a[1]];
 assert.ok(ab[0]*ac[1]-ab[1]*ac[0]<0,'upward normals when horizontal y becomes 3D Z');
});
test('límites de tamaño de malla protegen rendimiento',()=>{
 assert.throws(()=>terrainContours(()=>1,500,[0]),RangeError);
 assert.throws(()=>terrainContours(()=>NaN,20,[0]),RangeError);
 assert.throws(()=>terrainMeshSamples(0,1,1000),RangeError);
});
