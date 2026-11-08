/**
 * Mathscape → Atlas Geoespacial. Modelo didáctico SINTÉTICO, NO ES UN DEM.
 * Coordenadas horizontales locales proyectadas (metros), alturas en metros.
 * La elevación continua se muestrea en una grilla para experimentar con resolución.
 */
export const TERRAIN_EXTENT_M = 1000;
export type ElevationField=(x:number,y:number)=>number;
export type TerrainSummary={above:number;below:number;net:number;min:number;max:number;cellSize:number;cells:number};
const gaussian=(x:number,y:number,cx:number,cy:number,s:number)=>Math.exp(-((x-cx)**2+(y-cy)**2)/(2*s*s));
const clamp=(x:number,a:number,b:number)=>Math.min(b,Math.max(a,x));
const modelIndex=(v:number)=>clamp(Math.round(v||0),0,2);

/** Paisajes plausibles visualmente, sin referencia a mediciones topográficas. */
export function terrainElevation(x:number,y:number,model=0,irregularity=1):number{
 const r=clamp(irregularity,0,1.5),m=modelIndex(model);
 const texture=r*(25*Math.sin(x/71)*Math.cos(y/83)+9*Math.sin((x+2*y)/32));
 if(m===1){ // valle encajonado, cauce curvo
  const channel=y-.28*x-42*Math.sin(x/180);
  return 1000+.00027*(x+140)**2+.00012*(y-50)**2-115*Math.exp(-((channel/103)**2))+texture*.6;
 }
 if(m===2){ // ladera con formas de movimiento de suelos
  return 1110+.16*x-.055*y+85*gaussian(x,y,-110,70,240)-95*gaussian(x,y,240,-150,130)+texture;
 }
 return 1060+255*gaussian(x,y,-175,95,200)+128*gaussian(x,y,210,-70,245)-150*gaussian(x,y,-30,-175,170)+texture;
}

/** Forma simbólica exacta de cada paisaje para conectar gráfica, ecuación y cálculo. */
export function terrainEquation(model:number,irregularity:number):string{
 const r=clamp(irregularity,0,1.5).toFixed(2),m=modelIndex(model);
 const texture='T=25sen(x/71)cos(y/83)+9sen((x+2y)/32)';
 const G='G(cx,cy,s)=exp(−[(x−cx)²+(y−cy)²]/(2s²))';
 if(m===1)return `c=y−0.28x−42sen(x/180)\nz=1000+0.00027(x+140)²+0.00012(y−50)²−115exp(−(c/103)²)+0.6·${r}T\n${texture}`;
 if(m===2)return `z=1110+0.16x−0.055y+85G(−110,70,240)−95G(240,−150,130)+${r}T\n${G}\n${texture}`;
 return `z=1060+255G(−175,95,200)+128G(210,−70,245)−150G(−30,−175,170)+${r}T\n${G}\n${texture}`;
}
/** Volumen por método de puntos medios sobre celdas horizontales de igual área. */
export function integrateElevationField(field:ElevationField,n:number,datum:number,extent=TERRAIN_EXTENT_M):TerrainSummary{
 if(!Number.isInteger(n)||n<2||n>512||!Number.isFinite(datum)||!Number.isFinite(extent)||extent<=0)throw new RangeError('Malla o datum inválido');
 const dx=extent/n,lo=-extent/2;
 let above=0,below=0,min=Infinity,max=-Infinity;
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){
  const z=field(lo+(i+.5)*dx,lo+(j+.5)*dx);
  if(!Number.isFinite(z))throw new RangeError('Elevación no finita');
  const dz=z-datum;
  if(dz>=0)above+=dz*dx*dx;
  else below+=(-dz)*dx*dx;
  min=Math.min(min,z);max=Math.max(max,z);
 }
 return {above,below,net:above-below,min,max,cellSize:dx,cells:n*n};
}

/** Diferencias centrales en metros, ilustran derivación sobre un ráster. */
export function terrainGradient(field:ElevationField,x:number,y:number,step:number):readonly [number,number]{
 if(!(step>0))throw new RangeError('El paso debe ser positivo');
 return [(field(x+step,y)-field(x-step,y))/(2*step),(field(x,y+step)-field(x,y-step))/(2*step)];
}
// Cachear solo integrales del terreno; mover el punto o rotar la cámara no altera el volumen.
const integralCache=new Map<string,TerrainSummary>();
function cachedTerrainIntegral(field:ElevationField,model:number,irregularity:number,datum:number,n:number){
 const key=[model,irregularity,datum,n].join('|');
 const value=integralCache.get(key);if(value)return value;
 const computed=integrateElevationField(field,n,datum);
 if(integralCache.size>=32)integralCache.clear();
 integralCache.set(key,computed);return computed;
}
export function terrainReport(p:Record<string,number>){
 const model=modelIndex(p.landform||0),irregularity=p.irregularity??1,datum=p.datum??1080;
 const n=clamp(Math.round(p.gridN||20),8,56);
 const x=clamp(p.pickX||0,-350,350),y=clamp(p.pickY||0,-350,350);
 const field:ElevationField=(a,b)=>terrainElevation(a,b,model,irregularity);
 const coarse=cachedTerrainIntegral(field,model,irregularity,datum,n);
 const fine=cachedTerrainIntegral(field,model,irregularity,datum,120);
 const gradient=terrainGradient(field,x,y,coarse.cellSize);
 const slopePercent=Math.hypot(...gradient)*100;
 const slopeDegrees=Math.atan(slopePercent/100)*180/Math.PI;
 return {model,irregularity,datum,n,x,y,z:field(x,y),gradient,slopePercent,slopeDegrees,coarse,fine,
  samplingDifferencePercent:fine.above>0?100*Math.abs(coarse.above-fine.above)/fine.above:0};
}
