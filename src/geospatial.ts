/**
 * Mathscape Academy — Geospatial learning engine
 * All figures and reflectances below are SYNTHETIC educational data.
 * Mathematical projection formulas assume a unit sphere, not WGS84 geodesy.
 */
import {terrainElevation} from './terrain.ts';

export type Point = readonly [number,number];
export type Reflectance={blue:number;green:number;red:number;nir:number;swir:number;className:string};
export const DEG=Math.PI/180;
export const clip=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
export const projectionNames=['Equidistante cilíndrica','Mercator','Cilíndrica equivalente'] as const;

export function projectGeographic(lonDeg:number,latDeg:number,mode:number):Point{
 const lon=clip(lonDeg,-180,180)*DEG,lat=clip(latDeg,-84,84)*DEG;
 if(mode===1)return [lon,Math.log(Math.tan(Math.PI/4+lat/2))];
 if(mode===2)return [lon,Math.sin(lat)];
 return [lon,lat];
}
/** Factors of local linear scale on a unit sphere, for equatorial standard parallels. */
export function projectionDistortion(latDeg:number,mode:number){
 const cos=Math.cos(clip(latDeg,-84,84)*DEG);
 const east=1/cos, north=mode===1?1/cos:mode===2?cos:1;
 return {east,north,area:east*north,aspect:east/north};
}
/** One screen scale for both projected axes: avoid inventing deformation in the rendering. */
export function projectionFitScale(w:number,h:number,mode:number):number{
 if(!(w>0&&h>0))throw new RangeError('Viewport inválido');
 const ymax=Math.abs(projectGeographic(0,80,mode)[1]);
 return Math.min(w/(2*Math.PI),h*.9/(2*ymax));
}
/** Exact same cell-center selection is shared by visible sensor pixels and metrics. */
export function spectralPixelCenter(n:number,x:number,y:number){
 if(!Number.isInteger(n)||n<8||n>64)throw new RangeError('Grilla espectral inválida');
 const cell=1000/n;
 const i=clip(Math.floor((clip(x,-499.999,499.999)+500)/cell),0,n-1);
 const j=clip(Math.floor((clip(y,-499.999,499.999)+500)/cell),0,n-1);
 return {i,j,x:-500+(i+.5)*cell,y:-500+(j+.5)*cell};
}
export function haversineKm(lon1:number,lat1:number,lon2:number,lat2:number){
 const p1=lat1*DEG,p2=lat2*DEG,dphi=p2-p1,dl=(lon2-lon1)*DEG;
 const a=Math.sin(dphi/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
 return 6371.0088*2*Math.asin(Math.min(1,Math.sqrt(a)));
}

export const GEO_SIDE_M=1000;
export function rasterValue(n:number,i:number,j:number,model=0,irregularity=.8,showNoData=false):number|null{
 if(!Number.isInteger(n)||n<4||n>64||i<0||j<0||i>=n||j>=n)throw new RangeError('Pixel inválido');
 const x=-500+(i+.5)*GEO_SIDE_M/n,y=-500+(j+.5)*GEO_SIDE_M/n;
 if(showNoData&&Math.hypot(x-180,y+130)<95)return null;
 return terrainElevation(x,y,model,irregularity);
}
export function rasterInfo(n:number,model=0,irregularity=.8,mask=false,probeX=0,probeY=0){
 const grid=clip(Math.round(n),8,48),cell=GEO_SIDE_M/grid;
 let total=0,count=0,empty=0,min=Infinity,max=-Infinity;
 for(let j=0;j<grid;j++)for(let i=0;i<grid;i++){
  const val=rasterValue(grid,i,j,model,irregularity,mask);
  if(val===null){empty++;continue}
  total+=val;count++;min=Math.min(min,val);max=Math.max(max,val);
 }
 const i=clip(Math.floor((clip(probeX,-499,499)+500)/cell),0,grid-1);
 const j=clip(Math.floor((clip(probeY,-499,499)+500)/cell),0,grid-1);
 return {n:grid,cell,area:cell*cell,pixels:grid*grid,valid:count,nodata:empty,mean:total/count,min,max,query:[i,j] as Point,value:rasterValue(grid,i,j,model,irregularity,mask)};
}

export const normalizedDifference=(a:number,b:number)=>Math.abs(a+b)>1e-12?(a-b)/(a+b):NaN;
const soil={blue:.14,green:.19,red:.24,nir:.30,swir:.32};
const plant={blue:.04,green:.10,red:.055,nir:.48,swir:.21};
const water={blue:.10,green:.12,red:.045,nir:.016,swir:.009};
/** A synthetic mix of water, plant, and soil spectra. Not satellite measurements. */
export function syntheticSpectra(x:number,y:number,drought=0):Reflectance{
 const dry=clip(drought,0,1);
 const stream=y-(55*Math.sin(x/110)+110);
 const lake=(x+245)**2/(135**2)+(y+175)**2/(90**2);
 const wet=Math.abs(stream)<28||lake<1;
 const vegetation=clip(.3+.35*Math.sin(x/110)*Math.cos(y/98)+.25*Math.cos((x+y)/142),0,1)*(1-dry*.72);
 const mix=(band:keyof typeof soil)=>{
  if(wet)return water[band];
  return soil[band]*(1-vegetation)+plant[band]*vegetation;
 };
 const red=clip(mix('red')+(wet?0:dry*.02),0,1);
 const nir=clip(mix('nir')-(wet?0:dry*.11),0,1);
 return {blue:mix('blue'),green:mix('green'),red,nir,swir:mix('swir'),className:wet?'agua sintética':vegetation>.55?'vegetación sintética':'suelo mixto sintético'};
}
export function bandProducts(v:Reflectance){
 return {ndvi:normalizedDifference(v.nir,v.red),ndwi:normalizedDifference(v.green,v.nir)};
}
/** For demonstration only, never interpret display RGB as calibrated remote-sensing color. */
export function syntheticColor(v:Reflectance,mode:number):readonly [number,number,number]{
 const toByte=(n:number)=>Math.round(clip(n,0,1)*255);
 if(mode===1)return [toByte(v.nir*2.2),toByte(v.red*3),toByte(v.green*3)];
 const {ndvi,ndwi}=bandProducts(v),value=mode===2?ndvi:ndwi;
 if(mode===2)return [toByte(.58-.48*value),toByte(.52+.44*value),toByte(.22+.16*(1-value))];
 if(mode===3)return [toByte(.56-.44*value),toByte(.47+.34*value),toByte(.34+.55*value)];
 return [toByte(v.red*3),toByte(v.green*3),toByte(v.blue*3)];
}
export const sensorLabels=['RGB natural ilustrativo','Falso color NIR–R–G','NDVI','NDWI (McFeeters)'] as const;
