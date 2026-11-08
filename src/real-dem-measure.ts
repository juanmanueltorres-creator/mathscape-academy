import type {Result,Metric} from './measure';
import {DEM_SPEC,demReport,type DemGrid} from './real-dem';
const fmt=(x:number,d=1)=>x.toLocaleString('es-AR',{maximumFractionDigits:d});
const m=(label:string,value:string):Metric=>({label,value});
export function calculateRealDem(data:DemGrid|null,p:Record<string,number>,state:'idle'|'loading'|'ready'|'error',error:string|null):Result{
 if(!data)return {
  metrics:[m('Fuente','SRTM v3'),m('Muestreo','9 × 9'),m('Referencia','WGS84 / EGM96')],
  explanation:state==='error'?('No se pudieron cargar elevaciones reales: '+(error||'error de red')+'. Usá Reintentar cuando la fuente vuelva a responder. No se reemplazan mediciones con datos sintéticos.'):
   'Consultando 81 alturas reales a OpenTopoData. La descarga usa el conjunto SRTM 90 m (v3) en San Juan, con interpolación bilineal y coordenadas WGS84.',
  passed:false,observation:'San Juan · lat −31.4000°, lon −69.1000° · sin elevaciones inventadas; estado '+state+'.',
  formula:'Puntos (λ, φ) WGS84 → consulta SRTM90m\nz (m) respecto de EGM96\nEsperando respuesta verificada del proveedor.'
 };
 const x=Math.round(p.demX??4),y=Math.round(p.demY??4),datum=p.demDatum??2500;
 const r=demReport(data,x,y,datum),net=r.above-r.below;
 return {
  metrics:[m('Elevación SRTM (m)',r.point.z===null?'NoData':fmt(r.point.z)),m('Pendiente aprox. (°)',r.slope===null?'NoData':fmt(r.slope,2)),m('Área muestreada (km²)',fmt(r.area/1e6,3)),m('Volumen neto vs z₀ (m³)',fmt(net,0)),m('Puntos válidos',data.valid+' / 81')],
  explanation:'Esta es una grilla de 81 elevaciones REALMENTE consultadas al conjunto SRTM90m v3. Las curvas se interpolan entre muestras, y la pendiente usa diferencias finitas. La cuadrícula no es un GeoTIFF nativo. El volumen relativo a un plano es demostrativo: no sirve para calcular excavaciones ni estimar incertidumbre topográfica.',
  passed:data.valid>=75 && r.slope!==null,
  observation:'Fuente: '+DEM_SPEC.source+' · EPSG:4326 WGS84 · altura EGM96 (m). Separación de muestras: '+fmt(data.dxMeters,0)+' m E-O × '+fmt(data.dyMeters,0)+' m N-S; NO es resolución nativa. Fecha de consulta: '+data.requestedAt.slice(0,10)+'. NoData: '+data.noData+'.',
  formula:'∂z/∂E ≈ Δz/(ΔE) · ∂z/∂N ≈ Δz/(ΔN)\nθ ≈ arctan(√[(∂z/∂E)²+(∂z/∂N)²]) = '+(r.slope===null?'NoData':fmt(r.slope,2)+'°')+
   '\nV(z₀) ≈ Σ [z̄_celda − '+fmt(datum,0)+']·ΔE·ΔN\nV₊='+fmt(r.above,0)+' m³  ·  V₋='+fmt(r.below,0)+' m³\nz₀='+fmt(datum,0)+' m · EGM96 (referencia ilustrativa)'
 };
}
