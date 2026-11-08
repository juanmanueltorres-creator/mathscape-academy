import test from 'node:test';
import assert from 'node:assert/strict';
import {utmWGS84,illustrativeGK,utmZone,gaussKrugerFaja,geodesyReport,haversineDistanceM,transverseMercator} from '../src/geodesy.ts';
const close=(a,b,tol)=>assert.ok(Math.abs(a-b)<=tol,'Expected '+a+' within '+tol+' of '+b);
test('San Juan WGS84 / UTM zona 19S coincide con PROJ en metros',()=>{
 const p=utmWGS84(-31.4,-69.1);
 assert.equal(p.epsg,32719);assert.equal(p.zone,19);assert.equal(p.centralMeridian,-69);
 close(p.easting,490493.472899,1);close(p.northing,6526062.319502,1);
});
test('Córdoba WGS84 / UTM zona 20S validado con pyproj',()=>{
 const p=utmWGS84(-31.42,-64.18);
 assert.equal(p.epsg,32720);close(p.easting,387843.150861,1);close(p.northing,6523247.872193,1);
});
test('Buenos Aires WGS84 / UTM zona 21S validado con pyproj',()=>{
 const p=utmWGS84(-34.6,-58.38);
 assert.equal(p.epsg,32721);close(p.easting,373458.607185,1);close(p.northing,6170448.511332,1);
});
test('UTM falso norte Sur en ecuador y 500 km al meridiano central',()=>{
 const p=utmWGS84(-0.000001,-69);
 close(p.easting,500000,.01);close(p.northing,10000000,.2);
 assert.equal(utmZone(-69.1),19);assert.equal(utmZone(-64.18),20);assert.equal(utmZone(-58.38),21);
});
test('Definiciones de Gauss-Krüger fajas de IGN y EPSG',()=>{
 const s=illustrativeGK(-31.4,-69.1);
 assert.equal(s.epsg,5344);assert.equal(s.zone,2);assert.equal(s.centralMeridian,-69);assert.equal(s.falseEasting,2500000);
 close(s.easting,2490489.8871,3);close(s.northing,6526638.5167,3);
 const c=illustrativeGK(-31.42,-64.18);
 assert.equal(c.epsg,5346);assert.equal(c.zone,4);assert.equal(c.centralMeridian,-63);
 close(c.easting,4387798.4324,3);close(c.northing,6523822.9537,3);
 const b=illustrativeGK(-34.6,-58.38);
 assert.equal(b.epsg,5348);assert.equal(b.zone,6);
 close(b.easting,6373408.0697,3);close(b.northing,6170882.4412,3);
});
test('Grados de longitud no son metros uniformes entre latitudes',()=>{
 const equator=haversineDistanceM({lat:0,lon:-64},{lat:0,lon:-63.9});
 const cordoba=haversineDistanceM({lat:-31.42,lon:-64.18},{lat:-31.42,lon:-64.08});
 assert.ok(cordoba<equator&&cordoba>equator*.84&&cordoba<equator*.87);
});
test('Validación de dominio y métricas geodésicas',()=>{
 assert.throws(()=>utmWGS84(-82,-69),RangeError);
 assert.throws(()=>gaussKrugerFaja(-44),RangeError);
 assert.throws(()=>transverseMercator(0,0,-90,1,0,0),RangeError);
 const p=geodesyReport({geodesyLocation:1,geoLat:-31.42,geoLon:-64.18,geoCRS:0});
 assert.equal(p.coord.zone,20);assert.ok(p.eastDistance>9000&&p.eastDistance<10000);
 assert.ok(p.northDistance>11000&&p.northDistance<11500);
});
