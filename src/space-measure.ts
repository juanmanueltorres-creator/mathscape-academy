import type {Result,Metric} from './measure';
import {orbitSummary} from './satellites';
import {RADAR_KINDS,radarSummary} from './radar-lab';
import type {SceneId} from './content';
const fmt=(n:number,digits=1)=>n.toLocaleString('es-AR',{maximumFractionDigits:digits});
const m=(label:string,value:string):Metric=>({label,value});
export function calculateSpace(scene:SceneId,p:Record<string,number>):Result{
 if(scene==='satellites'){
  const idx=Math.max(0,Math.min(2,Math.round(p.orbitModel||0))),time=p.orbitTime??360;
  const r=orbitSummary(idx,time);
  return {
   metrics:[m('Altura (km)',fmt(r.mission.heightKm,0)),m('Período (min)',fmt(r.period)),m('Velocidad (km/s)',fmt(r.speed,2)),m('Horizonte angular',fmt(r.horizonAngle,1)+'°'),m('Órbitas en el tiempo',fmt(r.completedOrbits,2))],
   explanation:'Una órbita baja recorre la Tierra muchas veces por día. Una geoestacionaria ideal mantiene su longitud sobre el ecuador al igualar su período con la rotación terrestre. El mapa muestra una trayectoria kepleriana simplificada: NO es ubicación en vivo, TLE ni predicción de una pasada real. La huella geométrica de horizonte NO equivale al ancho de adquisición del sensor.',
   observation:r.mission.name+' · '+r.mission.kind+' · '+r.mission.instrument+' · barrido: '+r.mission.swath+' · revisita nominal: '+r.mission.revisit+'. El modelo ignora precesión heliosincrónica y perturbaciones.',
   formula:'T=2π√[(R⊕+h)³/μ⊕] = '+fmt(r.period,2)+' min\nv=√[μ⊕/(R⊕+h)] = '+fmt(r.speed,2)+' km/s\nα_horizonte=acos(R⊕/(R⊕+h)) = '+fmt(r.horizonAngle,2)+'°\nSubsatélite: '+fmt(r.point.lat,1)+'° lat, '+fmt(r.point.lon,1)+'° lon',
   passed:idx===2?Math.abs(r.point.lat)<1e-7:idx===0?time>=r.period:time>=r.period,
  };
 }
 const type=Math.max(0,Math.min(2,Math.round(p.radarType||0))),r=radarSummary(p);
 return {
  metrics:[m('Tecnología',type===2?'SAR':'Meteorológica'),m('Resultado simulado',fmt(r.value,2)+' '+r.unit),m('Dato de referencia',type===0?fmt(r.extra,0)+' Z':type===1?fmt(r.extra,1)+' m/s':fmt(r.extra,3)+' σ⁰'),m('Origen','SINTÉTICO')],
  explanation:r.explanation,
  observation:RADAR_KINDS[type].principle+' · Fuente para fundamentos: '+r.kind.source+'. Sin datos observados, sin monitoreo, sin avisos a la población.',
  formula:r.formula+(type===0?'\nZ=10^(dBZ/10); dBZ aquí no representa precipitación medida.':type===1?'\nVelocidad positiva = alejándose, negativa = acercándose.':'\nσ⁰ es retorno de superficie, no dBZ meteorológicos.'),
  passed:type===2?Math.round(p.radarIncidence??35)>=35:type===1?Math.abs(r.value)<5:(p.radarDbz??52)>=50
 };
}
