/** REAL topographic samples via OpenTopoData SRTMGL3 v3.
 * These are API-sampled, bilinearly interpolated elevations, NOT a native GeoTIFF.
 * WGS84 longitude/latitude, EGM96 orthometric elevations in metres.
 */
export const DEM_SPEC={
 dataset:'srtm90m',n:9,centerLat:-31.4000,centerLon:-69.1000,
 latHalfSpan:.004,lonHalfSpan:.005,
 source:'OpenTopoData public SRTM 90m v3 API',
 license:'USGS/NASA SRTM public data',
 sourceURL:'https://www.opentopodata.org/datasets/srtm/',
 docsURL:'https://www.usgs.gov/centers/eros/science/usgs-eros-archive-digital-elevation-shuttle-radar-topography-mission-srtm'
} as const;
export type DemPoint=Readonly<{lat:number;lon:number;z:number|null}>;
export type DemGrid={n:number;points:DemPoint[];requestedAt:string;min:number;max:number;valid:number;noData:number;dxMeters:number;dyMeters:number;sourceURL:string};
export const demCoordinates=()=>{
 const result:{lat:number;lon:number}[]=[];
 for(let j=0;j<DEM_SPEC.n;j++)for(let i=0;i<DEM_SPEC.n;i++)result.push({
  lat:Number((DEM_SPEC.centerLat+DEM_SPEC.latHalfSpan*(1-2*j/(DEM_SPEC.n-1))).toFixed(6)),
  lon:Number((DEM_SPEC.centerLon+DEM_SPEC.lonHalfSpan*(-1+2*i/(DEM_SPEC.n-1))).toFixed(6))
 });
 return result;
};
export function demAPIURL(){
 const locations=demCoordinates().map(p=>p.lat+','+p.lon).join('|');
 return 'https://api.opentopodata.org/v1/srtm90m?'+new URLSearchParams({locations,interpolation:'bilinear'}).toString();
}
export function parseDemResponse(input:unknown,requestedAt:string):DemGrid{
 if(!input||typeof input!=='object'||(input as {status?:unknown}).status!=='OK')throw new Error('El proveedor no devolvió estado OK');
 const rows=(input as {results?:unknown}).results;
 if(!Array.isArray(rows)||rows.length!==DEM_SPEC.n**2)throw new Error('La respuesta no contiene los 81 puntos solicitados');
 const coords=demCoordinates();let min=Infinity,max=-Infinity,valid=0;
 const points:DemPoint[]=rows.map((r,index)=>{
  if(!r||typeof r!=='object')throw new Error('Punto de elevación inválido');
  const item=r as {dataset?:unknown;elevation?:unknown;location?:{lat?:unknown;lng?:unknown}};
  const expected=coords[index];
  if(item.dataset!==DEM_SPEC.dataset||typeof item.location?.lat!=='number'||typeof item.location?.lng!=='number'
     ||Math.abs(item.location.lat-expected.lat)>2e-5||Math.abs(item.location.lng-expected.lon)>2e-5)
   throw new Error('El origen o las coordenadas no coinciden con lo solicitado');
  let z:number|null=null;
  if(item.elevation!==null&&item.elevation!==undefined){
   if(typeof item.elevation!=='number'||!Number.isFinite(item.elevation)||item.elevation< -500||item.elevation>9000)
    throw new Error('La elevación tiene un valor fuera de rango');
   z=item.elevation;valid++;min=Math.min(min,z);max=Math.max(max,z);
  }
  return {...expected,z};
 });
 if(valid<DEM_SPEC.n**2*.75)throw new Error('Hay demasiadas celdas sin datos para este ejercicio');
 const mPerDegLat=111132, mPerDegLon=111320*Math.cos(DEM_SPEC.centerLat*Math.PI/180);
 return {n:DEM_SPEC.n,points,requestedAt,min,max,valid,noData:points.length-valid,
  dxMeters:2*DEM_SPEC.lonHalfSpan*mPerDegLon/(DEM_SPEC.n-1),
  dyMeters:2*DEM_SPEC.latHalfSpan*mPerDegLat/(DEM_SPEC.n-1),
  sourceURL:demAPIURL()};
}
let cache:DemGrid|null=null;let inflight:Promise<DemGrid>|null=null;
export function loadRealDem():Promise<DemGrid>{
 if(cache)return Promise.resolve(cache);
 if(inflight)return inflight;
 const task=(async()=>{
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch(demAPIURL(),{signal:controller.signal,headers:{Accept:'application/json'}});
   if(!response.ok)throw new Error('El proveedor respondió HTTP '+response.status+(response.status===429?' (límite temporal de consultas)':''));
   const data=await response.json();
   const result=parseDemResponse(data,new Date().toISOString());
   cache=result;return result;
  }finally{clearTimeout(timeout)}
 })();
 inflight=task.finally(()=>{inflight=null});return inflight;
}
export const at=(grid:DemGrid,col:number,row:number):number|null=>grid.points[row*grid.n+col]?.z??null;
export function demReport(grid:DemGrid,col:number,row:number,datum:number){
 const i=Math.max(0,Math.min(grid.n-1,Math.round(col))),j=Math.max(0,Math.min(grid.n-1,Math.round(row)));
 const point=grid.points[j*grid.n+i];
 const east=(ii:number)=>at(grid,ii,j),north=(jj:number)=>at(grid,i,jj);
 const x1=Math.max(0,i-1),x2=Math.min(grid.n-1,i+1),y1=Math.max(0,j-1),y2=Math.min(grid.n-1,j+1);
 const z1=east(x1),z2=east(x2),zn=north(y1),zs=north(y2);
 const dzdx=z1!==null&&z2!==null?(z2-z1)/((x2-x1)*grid.dxMeters):null;
 const dzdy=zn!==null&&zs!==null?(zn-zs)/((y2-y1)*grid.dyMeters):null;
 const slope=dzdx===null||dzdy===null?null:Math.atan(Math.hypot(dzdx,dzdy))*180/Math.PI;
 let above=0,below=0,area=0,cells=0;
 for(let r=0;r<grid.n-1;r++)for(let c=0;c<grid.n-1;c++){
  const corners=[at(grid,c,r),at(grid,c+1,r),at(grid,c,r+1),at(grid,c+1,r+1)];
  if(corners.some(v=>v===null))continue;
  const z=(corners as number[]).reduce((s,v)=>s+v,0)/4;
  const volume=(z-datum)*grid.dxMeters*grid.dyMeters;
  if(volume>0)above+=volume;else below-=volume;
  area+=grid.dxMeters*grid.dyMeters;cells++;
 }
 return {point,i,j,dzdx,dzdy,slope,above,below,area,cells};
}
/** Bilinear interpolation on a regular sampling grid. Only for graphical isolines. */
export function interpolateDem(grid:DemGrid,x:number,y:number):number{
 const xx=Math.max(0,Math.min(grid.n-1,(x+500)/1000*(grid.n-1)));
 const yy=Math.max(0,Math.min(grid.n-1,(500-y)/1000*(grid.n-1)));
 const x0=Math.min(grid.n-2,Math.floor(xx)),y0=Math.min(grid.n-2,Math.floor(yy)),fx=xx-x0,fy=yy-y0;
 const corners=[at(grid,x0,y0),at(grid,x0+1,y0),at(grid,x0,y0+1),at(grid,x0+1,y0+1)];
 if(corners.some(a=>a===null))return NaN;
 const [a,b,c,d]=corners as number[];
 return a*(1-fx)*(1-fy)+b*fx*(1-fy)+c*(1-fx)*fy+d*fx*fy;
}
