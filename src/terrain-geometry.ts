import {terrainElevation,TERRAIN_EXTENT_M,type ElevationField} from './terrain';

/** A segment connects equal-elevation points in projected local metres. */
export type XY=readonly [number,number];
export type ContourSegment=readonly [XY,XY];
export type ContourLine={level:number;segments:ContourSegment[]};

/** Marching triangles: two triangles per raster cell avoid ambiguous saddle cases. */
export function terrainContours(field:ElevationField,n:number,levels:readonly number[],extent=TERRAIN_EXTENT_M):ContourLine[]{
 if(!Number.isInteger(n)||n<4||n>80||!Number.isFinite(extent)||extent<=0||levels.some(x=>!Number.isFinite(x)))throw new RangeError('Parámetros de curvas de nivel inválidos');
 const dx=extent/n,origin=-extent/2;
 type Vertex=readonly [number,number,number];
 const vertices:Vertex[]=[];
 for(let y=0;y<=n;y++)for(let x=0;x<=n;x++){
  const px=origin+x*dx,py=origin+y*dx,z=field(px,py);
  if(!Number.isFinite(z))throw new RangeError('Elevación no finita');
  vertices.push([px,py,z]);
 }
 const vert=(i:number,j:number)=>vertices[j*(n+1)+i];
 const contours:ContourLine[]=levels.map(level=>({level,segments:[]}));
 const edge=(a:Vertex,b:Vertex,level:number):XY|null=>{
  // Half-open: every grid vertex belongs deterministically to one side.
  if((a[2]<level)===(b[2]<level))return null;
  const t=(level-a[2])/(b[2]-a[2]);
  return [a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])];
 };
 const triangle=(a:Vertex,b:Vertex,c:Vertex)=>{
  for(const contour of contours){
   const points=[edge(a,b,contour.level),edge(b,c,contour.level),edge(c,a,contour.level)].filter((pt):pt is XY=>pt!==null);
   if(points.length===2&&Math.hypot(points[0][0]-points[1][0],points[0][1]-points[1][1])>1e-9)contour.segments.push([points[0],points[1]]);
  }
 };
 for(let j=0;j<n;j++)for(let i=0;i<n;i++){
  const a=vert(i,j),b=vert(i+1,j),c=vert(i+1,j+1),d=vert(i,j+1);
  triangle(a,b,c);triangle(a,c,d);
 }
 return contours;
}
export const terrainField=(model:number,roughness:number):ElevationField=>(x,y)=>terrainElevation(x,y,model,roughness);
export function terrainMeshSamples(model:number,roughness:number,n:number,extent=TERRAIN_EXTENT_M){
 if(!Number.isInteger(n)||n<4||n>80||extent<=0)throw new RangeError('Grilla inválida');
 const positions:number[]=[];const faces:number[]=[];
 const dx=extent/n;
 for(let j=0;j<=n;j++)for(let i=0;i<=n;i++){
  const x=-extent/2+i*dx,y=-extent/2+j*dx;
  positions.push(x,y,terrainElevation(x,y,model,roughness));
 }
 for(let j=0;j<n;j++)for(let i=0;i<n;i++){
  const a=j*(n+1)+i,b=a+1,d=a+n+1,c=d+1;
  faces.push(a,c,b,a,d,c);
 }
 return {positions,faces,vertices:(n+1)**2,triangles:2*n*n};
}
