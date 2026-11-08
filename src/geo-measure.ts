import type {SceneId} from './content';
import type {Result,Metric} from './measure';
import {projectionDistortion,projectionNames,rasterInfo,syntheticSpectra,bandProducts,sensorLabels,spectralPixelCenter} from './geospatial';
const fmt=(n:number,digits=2)=>Number(n.toFixed(digits)).toLocaleString('es-AR');
const metric=(label:string,n:number,digits=2):Metric=>({label,value:fmt(n,digits)});
export function calculateGeospatial(scene:SceneId,p:Record<string,number>):Result{
 if(scene==='projection'){
  const mode=Math.round(p.projectionMode||0),lat=p.probeLat??45,lon=p.probeLon??-60;
  const d=projectionDistortion(lat,mode);
  const formulas=['x=R·λ; y=R·φ','x=R·λ; y=R·ln(tan(π/4+φ/2))','x=R·λ; y=R·sen(φ)'];
  return {
   metrics:[{label:'Proyección',value:projectionNames[mode]||projectionNames[0]},metric('Escala E–O',d.east),metric('Escala N–S',d.north),metric('Factor de área',d.area)],
   explanation:'Proyectar es transformar coordenadas. La graticula muestra paralelos y meridianos; los círculos geográficos se deforman de manera distinta según el mapa. No hay una proyección plana que conserve todas las propiedades globalmente.',
   observation:'Punto λ='+fmt(lon,0)+'°, φ='+fmt(lat,0)+'°. Modelo esférico con paralelo estándar en el ecuador. Valores locales; no es un cálculo geodésico WGS84.',
   formula:(formulas[mode]||formulas[0])+'\nλ y φ en radianes; k_area=k_EO·k_NS='+fmt(d.area)+'\nConservación de área: '+(mode===2?'sí (ideal esférico)':'no'),
   passed:mode===2&&Math.abs(d.area-1)<1e-10
  };
 }
 if(scene==='raster'){
  const m=Math.round(p.rasterTerrain||0),n=Math.round(p.rasterN||22);
  const r=rasterInfo(n,m,p.rasterRough??.8,(p.rasterMask||0)>0,p.rasterX||0,p.rasterY||0);
  return {
   metrics:[metric('Tamaño de celda (m)',r.cell),metric('Píxeles',r.pixels),metric('NoData',r.nodata),{label:'Valor del píxel',value:r.value===null?'NoData':fmt(r.value)+' m'},metric('Elevación media (m)',r.mean)],
   explanation:'Un ráster almacena valores en celdas: aumentar el tamaño de píxel pierde detalle. Una ruta o un cauce pueden representarse como líneas vectoriales superpuestas, sin modificar el valor de elevación. El NoData no debe confundirse con elevación cero.',
   observation:'Área sintética de 1 km², coordenadas planas locales. Ráster: '+r.n+'×'+r.n+'. Cauce y ruta vectoriales ilustrativos sin precisión cartográfica. No incluye transformación de CRS.',
   formula:'Tamaño de píxel = 1000 m / '+r.n+' = '+fmt(r.cell)+' m\nÁrea de celda = Δx·Δy = '+fmt(r.area)+' m²\nMedida media = Σ zᵢⱼ / N_válidos',
   passed:r.nodata>0&&r.cell<=40
  };
 }
 const mode=Math.round(p.sensorMode||0),dry=p.sensorDryness||0;
 const sample=spectralPixelCenter(Math.round(p.sensorN||32),p.sensorX||0,p.sensorY||0);
 const r=syntheticSpectra(sample.x,sample.y,dry),i=bandProducts(r);
 const label=sensorLabels[mode]||sensorLabels[0];
 const formulas=['R=rojo, G=verde, B=azul','R=NIR, G=rojo, B=verde','NDVI=(NIR−Rojo)/(NIR+Rojo)','NDWI=(Verde−NIR)/(Verde+NIR)'];
 return {
  metrics:[{label:'Visualización',value:label},metric('Reflectancia roja',r.red,3),metric('Reflectancia NIR',r.nir,3),metric('NDVI',i.ndvi,3),metric('NDWI',i.ndwi,3)],
  explanation:'Un sensor multiespectral registra bandas, no una fotografía de color universal. Combinar rojo e infrarrojo próximo permite explorar vegetación; comparar verde y NIR (NDWI de McFeeters) resalta agua en algunos contextos. Los índices pueden confundirse con suelo, sombras y condiciones atmosféricas.',
  observation:'Material de celda: '+r.className+' (centro: '+fmt(sample.x,1)+' m, '+fmt(sample.y,1)+' m). Parámetros de reflectancia SINTÉTICOS, sin atmósfera, nubes, calibración ni incertidumbre. No representa un dato Landsat/SAOCOM ni predice una sequía.',
  formula:(formulas[mode]||formulas[0])+'\nNDVI='+fmt(i.ndvi,3)+'; NDWI='+fmt(i.ndwi,3)+'\nÍndice ≠ clasificación o riesgo validado',
  passed:mode>=2&&Number.isFinite(i.ndvi)&&Number.isFinite(i.ndwi)
 };
}
