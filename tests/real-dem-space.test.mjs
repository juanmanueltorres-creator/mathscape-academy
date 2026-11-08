import test from 'node:test';
import assert from 'node:assert/strict';
import {DEM_SPEC,demCoordinates,demAPIURL,parseDemResponse,demReport,interpolateDem} from '../src/real-dem.ts';
import {ORBIT_MISSIONS,GEO_HEIGHT_KM,SIDEREAL_DAY_S,orbitPeriodMin,orbitalVelocityKmS,horizonHalfAngleRad,groundPoint,orbitSummary} from '../src/satellites.ts';
import {RADAR_KINDS,dbzToLinear,linearToDbz,radialVelocity,radarSummary,syntheticSigma0,sigmaToDb} from '../src/radar-lab.ts';
const close=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<=tol,'expected '+a+' ≈ '+b);
const mock=(fn=(i,j)=>2500+i*3+j*5)=>({
 status:'OK',
 results:demCoordinates().map((point,index)=>({
  dataset:'srtm90m',location:{lat:point.lat,lng:point.lon},
  elevation:fn(index%DEM_SPEC.n,Math.floor(index/DEM_SPEC.n))
 }))
});
test('SRTM consultado: 81 coordenadas, WGS84, límites en San Juan',()=>{
 const coords=demCoordinates();assert.equal(coords.length,81);
 assert.ok(coords[0].lat>coords[72].lat);assert.ok(coords[0].lon<coords[8].lon);
 close(coords[40].lat,-31.4);close(coords[40].lon,-69.1);
 const url=demAPIURL();assert.ok(url.includes('/v1/srtm90m?'));assert.ok(url.includes('interpolation=bilinear'));
 assert.equal(new URL(url).searchParams.get('locations')?.split('|').length,81);
});
test('Un SRTM válido conserva posición y datos medidos, no inventa valores',()=>{
 const d=parseDemResponse(mock(),'2026-11-07T00:00:00.000Z');
 assert.equal(d.valid,81);assert.equal(d.noData,0);assert.equal(d.min,2500);assert.equal(d.max,2564);
 assert.ok(d.dxMeters>100&&d.dxMeters<150);assert.ok(d.dyMeters>90&&d.dyMeters<140);
 const r=demReport(d,4,4,2500);assert.equal(r.point.z,2532);assert.ok(r.slope!==null&&r.slope>0);assert.ok(r.area>800000);
 close(interpolateDem(d,0,0),2532);
});
test('Plano constante tiene pendiente cero y volumen = altura × área',()=>{
 const d=parseDemResponse(mock(()=>2520),'2026-11-07');
 const r=demReport(d,4,4,2500);
 close(r.slope,0);close(r.above,20*r.area,.01);close(r.below,0);
 close(interpolateDem(d,241,73),2520);
});
test('NoData no se reemplaza por cero y las celdas inválidas se excluyen',()=>{
 const d=parseDemResponse(mock((i,j)=>i===0&&j===0?null:2400),'2026-11-07');
 assert.equal(d.noData,1);assert.equal(d.points[0].z,null);
 const r=demReport(d,1,1,2300);assert.equal(r.cells,63);assert.ok(r.area>0);
 assert.ok(Number.isNaN(interpolateDem(d,-500,500)));
});
test('El parser rechaza fuentes apócrifas y coordenadas modificadas',()=>{
 const raw=mock();raw.results[0].dataset='fake';
 assert.throws(()=>parseDemResponse(raw,'2026-11-07'),/origen|coordenadas/);
 const other=mock();other.results[1].location.lng=19;
 assert.throws(()=>parseDemResponse(other,'2026-11-07'),/origen|coordenadas/);
 assert.throws(()=>parseDemResponse({status:'ERROR'},'2026-11-07'));
});
test('Kepler: períodos de Sentinel-2, SAOCOM y GEO aproximados correctamente',()=>{
 const s=orbitPeriodMin(786),a=orbitPeriodMin(620);
 assert.ok(s>99&&s<102);assert.ok(a>95&&a<99);
 close(orbitPeriodMin(GEO_HEIGHT_KM)*60,SIDEREAL_DAY_S,.005);
 assert.ok(orbitalVelocityKmS(620)>orbitalVelocityKmS(786));
 assert.ok(orbitalVelocityKmS(786)>orbitalVelocityKmS(GEO_HEIGHT_KM));
 assert.equal(ORBIT_MISSIONS.length,3);
});
test('GEO conserva longitud y ecuador en la rotación sidérea simplificada',()=>{
 const a=groundPoint(2,0),b=groundPoint(2,800),c=groundPoint(2,1436);
 close(a.lon,b.lon,1e-6);close(a.lon,c.lon,1e-6);close(a.lat,0);close(b.lat,0);
});
test('Órbita casi polar pasa por latitudes altas y el horizonte aumenta con altura',()=>{
 const s=orbitSummary(0,orbitPeriodMin(786)*.25);
 assert.ok(Math.abs(s.point.lat)>75);
 assert.ok(horizonHalfAngleRad(GEO_HEIGHT_KM)>horizonHalfAngleRad(620));
 assert.ok(Number.isFinite(s.point.lon));
});
test('Radar: dBZ es logaritmo de reflectividad lineal',()=>{
 for(const dbz of [-10,0,20,45,60])close(linearToDbz(dbzToLinear(dbz)),dbz,1e-7);
 assert.throws(()=>linearToDbz(0),RangeError);
});
test('Radar Doppler mide sólo componente radial con signo',()=>{
 close(radialVelocity(25,90,90),25);close(radialVelocity(25,90,0),0);close(radialVelocity(25,90,270),-25);
});
test('Radar SAR usa σ⁰ y no dBZ meteorológicos',()=>{
 assert.equal(RADAR_KINDS.length,3);assert.equal(RADAR_KINDS[0].unit,'dBZ');assert.equal(RADAR_KINDS[1].unit,'m/s');assert.equal(RADAR_KINDS[2].unit,'dB σ⁰');
 const s=syntheticSigma0(.8,35);assert.ok(s>0&&s<1);assert.ok(sigmaToDb(s)<0);
 const v=radarSummary({radarType:2,radarRoughness:.8,radarIncidence:35});
 assert.equal(v.unit,'dB σ⁰');assert.ok(Number.isFinite(v.value));
});
