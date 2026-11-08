/** Circular two-body orbital physics used for EDUCATIONAL diagrams only.
 * Not ephemerides, no live satellite positions, no TLE/J2 perturbations.
 */
export const R_EARTH_KM=6378.137;
export const MU_EARTH=398600.4418; // km^3/s^2
export const SIDEREAL_DAY_S=86164.0905;
export const EARTH_ROT=2*Math.PI/SIDEREAL_DAY_S;
export const GEO_HEIGHT_KM=Math.cbrt(MU_EARTH/(EARTH_ROT**2))-R_EARTH_KM;
export type OrbitMission={name:string;kind:string;heightKm:number;inclinationDeg:number;instrument:string;swath:string;revisit:string;source:string};
export const ORBIT_MISSIONS:readonly OrbitMission[]=[
 {name:'Sentinel-2',kind:'Óptico heliosincrónico',heightKm:786,inclinationDeg:98.62,instrument:'MSI · 13 bandas',swath:'290 km',revisit:'5 días (constelación de 2, referencia nominal)',source:'https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/Facts_and_figures'},
 {name:'SAOCOM',kind:'SAR de banda L · órbita heliosincrónica',heightKm:620,inclinationDeg:98,instrument:'SAR banda L · 1,275 GHz',swath:'20–350 km (según modo)',revisit:'8 días (constelación 1A/1B, repetición)',source:'https://www.argentina.gob.ar/ciencia/conae/misiones-espaciales/saocom/caracteristicas-tecnicas'},
 {name:'Geoestacionario ideal',kind:'Geoestacionaria ecuatorial ideal',heightKm:GEO_HEIGHT_KM,inclinationDeg:0,instrument:'Observación meteorológica continua',swath:'Disco visible (no equivale a imagen útil)',revisit:'Vista prácticamente continua (modelo ideal)',source:'https://science.nasa.gov/earth/earth-observatory/catalog-of-earth-satellite-orbits/'}
] as const;
export const rad=(x:number)=>x*Math.PI/180;
export const deg=(x:number)=>x*180/Math.PI;
export const normalizeLon=(x:number)=>((x+180)%360+360)%360-180;
/** Illustration only: marker follows exactly the same rotated ellipse drawn on Canvas. */
export function orbitEllipsePoint(phase:number,rx:number,ry:number,rotation:number):readonly [number,number]{
 const a=rx*Math.cos(phase),b=ry*Math.sin(phase);
 return [a*Math.cos(rotation)-b*Math.sin(rotation),a*Math.sin(rotation)+b*Math.cos(rotation)];
}
export function orbitPeriodMin(heightKm:number){
 if(!Number.isFinite(heightKm)||heightKm<150||heightKm>100000)throw new RangeError('Altura orbital inválida');
 return 2*Math.PI*Math.sqrt((R_EARTH_KM+heightKm)**3/MU_EARTH)/60;
}
export function orbitalVelocityKmS(heightKm:number){return Math.sqrt(MU_EARTH/(R_EARTH_KM+heightKm))}
export function horizonHalfAngleRad(heightKm:number){return Math.acos(R_EARTH_KM/(R_EARTH_KM+heightKm))}
export function horizonVisibleAreaKm2(heightKm:number){return 2*Math.PI*R_EARTH_KM**2*(1-Math.cos(horizonHalfAngleRad(heightKm)))}
export function groundPoint(mission:number,elapsedMin:number){
 const idx=Math.max(0,Math.min(2,Math.round(mission))),m=ORBIT_MISSIONS[idx];
 if(!Number.isFinite(elapsedMin))throw new RangeError('Tiempo inválido');
 const phase=elapsedMin/orbitPeriodMin(m.heightKm)*2*Math.PI,i=rad(m.inclinationDeg),earth=elapsedMin*60*EARTH_ROT;
 // Orbit plane fixed inertially; Earth rotates below. Sun-synchronous nodal drift ignored.
 const x=Math.cos(phase),y=Math.sin(phase)*Math.cos(i),z=Math.sin(phase)*Math.sin(i);
 const longitude=normalizeLon(deg(Math.atan2(y,x)-earth)-65);
 const latitude=deg(Math.asin(Math.max(-1,Math.min(1,z))));
 return {lon:longitude,lat:latitude};
}
export function orbitSummary(index:number,timeMin:number){
 const idx=Math.max(0,Math.min(2,Math.round(index))),mission=ORBIT_MISSIONS[idx];
 const period=orbitPeriodMin(mission.heightKm),speed=orbitalVelocityKmS(mission.heightKm);
 const angle=deg(horizonHalfAngleRad(mission.heightKm)),point=groundPoint(idx,timeMin);
 return {mission,period,speed,horizonAngle:angle,horizonArea:horizonVisibleAreaKm2(mission.heightKm),point,completedOrbits:timeMin/period};
}
