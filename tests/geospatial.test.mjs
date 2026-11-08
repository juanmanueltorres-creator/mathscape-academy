import test from 'node:test';
import assert from 'node:assert/strict';
import {projectGeographic,projectionDistortion,haversineKm,rasterValue,rasterInfo,syntheticSpectra,bandProducts,normalizedDifference,syntheticColor} from '../src/geospatial.ts';
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,'expected '+a+' ≈ '+b);
test('Equirectangular, Mercator y equivalente tienen centro en 0,0',()=>{
 for(let i=0;i<3;i++){const [x,y]=projectGeographic(0,0,i);close(x,0);close(y,0)}
});
test('Distorsión local del área en latitud 60° sobre esfera',()=>{
 close(projectionDistortion(60,0).area,2);
 close(projectionDistortion(60,1).area,4);
 close(projectionDistortion(60,2).area,1);
});
test('Mercator es conforme: las escalas locales coinciden',()=>{
 const m=projectionDistortion(55,1);close(m.east,m.north);
 assert.ok(projectGeographic(0,70,1)[1]>projectGeographic(0,35,1)[1]);
});
test('La distancia de 90 grados en ecuador mide cuarto de circunferencia',()=>{
 close(haversineKm(0,0,90,0),Math.PI*6371.0088/2,.00001);
});
test('Raster 1 km²: tamaño de celda y NoData no equivale a altura cero',()=>{
 const a=rasterInfo(20,0,.8,false),b=rasterInfo(40,0,.8,true);
 close(a.cell,50);close(b.cell,25);assert.equal(a.pixels,400);
 assert.ok(b.nodata>0);assert.equal(b.valid+b.nodata,b.pixels);
 assert.ok(b.min>0);assert.ok(b.max>b.min);
});
test('Consulta a píxel retorna mismo valor que la malla',()=>{
 const a=rasterInfo(24,1,.5,false,120,-220);
 const [i,j]=a.query;
 close(a.value,rasterValue(24,i,j,1,.5,false));
});
test('Indices multiespectrales con relación normalizada bien acotada',()=>{
 close(normalizedDifference(.4,.1),.6);
 assert.ok(Number.isNaN(normalizedDifference(0,0)));
 for(const p of [[0,0],[300,280],[-220,-170]]){
  const v=syntheticSpectra(p[0],p[1],.2),indices=bandProducts(v);
  assert.ok(Number.isFinite(indices.ndvi)&&Math.abs(indices.ndvi)<=1);
  assert.ok(Number.isFinite(indices.ndwi)&&Math.abs(indices.ndwi)<=1);
 }
});
test('Agua simulada presenta NDWI McFeeters positivo',()=>{
 const water=syntheticSpectra(-240,-200,0);
 assert.equal(water.className,'agua sintética');
 assert.ok(bandProducts(water).ndwi>0);
});
test('La sequedad reduce el NDVI de un píxel terrestre representativo',()=>{
 const a=bandProducts(syntheticSpectra(300,280,0)).ndvi;
 const b=bandProducts(syntheticSpectra(300,280,1)).ndvi;
 assert.ok(a>b);
});
test('Las representaciones dan valores RGB válidos',()=>{
 const v=syntheticSpectra(120,350,.5);
 for(let mode=0;mode<4;mode++){
  const rgb=syntheticColor(v,mode);
  assert.equal(rgb.length,3);
  for(const component of rgb)assert.ok(Number.isInteger(component)&&component>=0&&component<=255);
 }
});
