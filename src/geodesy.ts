/**
 * Mathscape Academy - geodesy teaching engine.
 * Numerical WGS84 ellipsoidal Transverse Mercator forward series.
 * Coordinates in decimal degrees to metres. No official datum transformation
 * WGS84↔POSGAR07 is performed: GK uses the same ellipsoid solely to
 * demonstrate projection geometry, NOT production survey coordinates.
 */
export const WGS84_A=6378137;
export const WGS84_INV_F=298.257223563;
export const WGS84_F=1/WGS84_INV_F;
export const WGS84_E2=WGS84_F*(2-WGS84_F);
export const R_MEAN=6371008.8;
export const RAD=Math.PI/180;
export type GeoPoint={lat:number;lon:number};
export type Projected={easting:number;northing:number;centralMeridian:number;epsg:number;label:string;zone:number;scale:number;falseEasting:number;falseNorthing:number};
export const LOCATIONS=[
 {name:'San Juan · Precordillera',lat:-31.4,lon:-69.1},
 {name:'Córdoba · ciudad',lat:-31.42,lon:-64.18},
 {name:'Buenos Aires · ciudad',lat:-34.6,lon:-58.38}
] as const;
const square=(x:number)=>x*x;
const clamp=(n:number,a:number,b:number)=>Math.min(b,Math.max(a,n));
function meridionalArc(phi:number){
 const e=WGS84_E2,e4=e*e,e6=e4*e;
 return WGS84_A*((1-e/4-3*e4/64-5*e6/256)*phi
 -(3*e/8+3*e4/32+45*e6/1024)*Math.sin(2*phi)
 +(15*e4/256+45*e6/1024)*Math.sin(4*phi)
 -(35*e6/3072)*Math.sin(6*phi));
}
export function transverseMercator(lat:number,lon:number,lon0:number,k0:number,falseEasting:number,falseNorthing:number,lat0=0){
 if(![lat,lon,lon0,k0,falseEasting,falseNorthing,lat0].every(Number.isFinite)||lat<=-89||lat>=89||Math.abs(lon-lon0)>6||k0<=0)
  throw new RangeError('Coordenadas fuera del dominio didáctico de Mercator Transversa');
 const phi=lat*RAD,phi0=lat0*RAD,L=(lon-lon0)*RAD;
 const s=Math.sin(phi),c=Math.cos(phi),t=Math.tan(phi);
 const e2=WGS84_E2, ep2=e2/(1-e2),N=WGS84_A/Math.sqrt(1-e2*s*s),T=t*t,C=ep2*c*c,A=c*L;
 const M=meridionalArc(phi)-meridionalArc(phi0);
 const east=falseEasting+k0*N*(A+(1-T+C)*A**3/6+(5-18*T+T*T+72*C-58*ep2)*A**5/120);
 const north=falseNorthing+k0*(M+N*t*(A*A/2+(5-T+9*C+4*C*C)*A**4/24+(61-58*T+T*T+600*C-330*ep2)*A**6/720));
 return {easting:east,northing:north};
}
export function utmZone(lon:number){
 if(!Number.isFinite(lon)||lon < -180||lon>180)throw new RangeError('Longitud inválida');
 return clamp(Math.floor((lon+180)/6)+1,1,60);
}
export function utmWGS84(lat:number,lon:number):Projected{
 if(lat < -80||lat>84)throw new RangeError('UTM fuera de sus límites de latitud');
 const zone=utmZone(lon),center=-183+zone*6,south=lat<0,fe=500000,fn=south?10000000:0;
 const {easting,northing}=transverseMercator(lat,lon,center,.9996,fe,fn);
 return {easting,northing,centralMeridian:center,epsg:(south?32700:32600)+zone,
 label:'WGS84 / UTM zona '+zone+(south?'S':'N'),zone,scale:.9996,falseEasting:fe,falseNorthing:fn};
}
export function gaussKrugerFaja(lon:number){
 if(!Number.isFinite(lon)||lon < -73.5||lon> -52.5)throw new RangeError('Fuera del esquema de las 7 fajas argentinas');
 return clamp(Math.round((lon+72)/3)+1,1,7);
}
/** Same WGS84 ellipsoid, but POSGAR07 frame datum shifts ARE NOT applied. */
export function illustrativeGK(lat:number,lon:number):Projected{
 const zone=gaussKrugerFaja(lon),center=-72+(zone-1)*3,fe=zone*1000000+500000;
 const {easting,northing}=transverseMercator(lat,lon,center,1,fe,0,-90);
 return {easting,northing,centralMeridian:center,epsg:5342+zone,
 label:'Esquema Gauss-Krüger / faja '+zone+' (no transformación POSGAR07)',zone,scale:1,falseEasting:fe,falseNorthing:0};
}
export function haversineDistanceM(a:GeoPoint,b:GeoPoint){
 const p1=a.lat*RAD,p2=b.lat*RAD,dl=(b.lon-a.lon)*RAD;
 const s=Math.sin((p2-p1)/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
 return 2*R_MEAN*Math.asin(Math.min(1,Math.sqrt(s)));
}
export function geodesyReport(p:Record<string,number>){
 const location=Math.max(0,Math.min(2,Math.round(p.geodesyLocation||0)));
 const place=LOCATIONS[location],lat=p.geoLat??place.lat,lon=p.geoLon??place.lon;
 const mode=Math.round(p.geoCRS||0);
 const coord=mode===0?utmWGS84(lat,lon):illustrativeGK(lat,lon);
 const eastDeg=111320*Math.cos(lat*RAD),northDeg=111132;
 const dLon=.1,dLat=.1;
 const sameLatitude={lat,lon:lon+dLon},sameLongitude={lat:lat+dLat,lon};
 return {place,lat,lon,mode,coord,eastDeg,northDeg,
  eastDistance:haversineDistanceM({lat,lon},sameLatitude),
  northDistance:haversineDistanceM({lat,lon},sameLongitude),
  separationFromCentral:Math.abs(lon-coord.centralMeridian)};
}
