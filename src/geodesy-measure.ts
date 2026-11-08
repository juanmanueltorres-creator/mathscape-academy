import type {Result,Metric} from './measure';
import {geodesyReport,WGS84_A,WGS84_INV_F} from './geodesy';
const fmt=(n:number,decimals=2)=>n.toLocaleString('es-AR',{maximumFractionDigits:decimals});
const item=(label:string,value:string):Metric=>({label,value});
export function calculateGeodesy(p:Record<string,number>):Result{
 const r=geodesyReport(p),crs=r.coord,utm=r.mode===0;
 return {
  metrics:[
   item('Latitud, longitud',fmt(r.lat,4)+'° / '+fmt(r.lon,4)+'°'),
   item('Este E (m)',fmt(crs.easting,1)),
   item('Norte N (m)',fmt(crs.northing,1)),
   item('Zona/faja · EPSG',crs.zone+' · '+crs.epsg),
   item('0,1° hacia el Este (km)',fmt(r.eastDistance/1000,3)),
   item('0,1° hacia el Norte (km)',fmt(r.northDistance/1000,3))
  ],
  explanation:utm?
   'WGS84 guarda posiciones sobre un elipsoide (grados). UTM proyecta a un plano por zonas de 6° y entrega metros. En el hemisferio sur se suma un falso norte de 10.000.000 m; el falso este es 500.000 m. El tamaño de un grado de longitud cambia según latitud.':
   'POSGAR07 es un MARCO GEODÉSICO oficial argentino, no una proyección. Las siete fajas Gauss-Krüger usan Mercator Transversa a lo largo de 3°; cada faja tiene un falso este propio. Esta demostración aplica las ecuaciones sobre coordenadas WGS84: NO realiza la transformación de datum/época hacia POSGAR07, por lo tanto no entrega coordenadas POSGAR07 oficiales.',
  observation:r.place.name+' · '+crs.label+' · meridiano central '+crs.centralMeridian+'° · distancia al meridiano '+fmt(r.separationFromCentral,2)+'°. La grilla de la derecha está expresada en metros e igual escala E/N. Elipsóide WGS84, sin transformación vertical.',
  formula:utm?
   'Zona UTM = ⌊(λ+180)/6⌋+1 = '+crs.zone+'\nλ₀=−183°+6·zona = '+crs.centralMeridian+'°\nk₀=0,9996 · E₀=500.000 m · N₀=10.000.000 m (sur)\nMercator transversa elipsoidal · a='+fmt(WGS84_A,0)+' m · 1/f='+fmt(WGS84_INV_F,9):
   'Faja GK='+crs.zone+' · λ₀='+crs.centralMeridian+'°\nk₀=1 · E₀='+fmt(crs.falseEasting,0)+' m · origen φ₀=−90°\nEPSG:'+crs.epsg+' = POSGAR 2007 / Argentina '+crs.zone+' (definición oficial)\nCálculo mostrado: WGS84 geométrico SIN cambio de marco geodésico.',
  passed:utm?Math.abs(crs.easting-500000)<120000:r.separationFromCentral<1.5
 };
}
