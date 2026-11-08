import {terrainElevation,terrainReport,TERRAIN_EXTENT_M} from './terrain';

/** Superficie 2.5D y perfil topográfico. Sin motor 3D ni datos geográficos inventados. */
export function drawTerrainLayer(c:CanvasRenderingContext2D,w:number,h:number,p:Record<string,number>,angle:number){
 const r=terrainReport(p),n=r.n,half=TERRAIN_EXTENT_M/2,dx=TERRAIN_EXTENT_M/n;
 const theta=angle+1.35,ct=Math.cos(theta),st=Math.sin(theta);
 const scale=Math.min(w*.60,h*.69)/TERRAIN_EXTENT_M;
 const project=(x:number,y:number,z:number):[number,number,number]=>{
  const rx=x*ct-y*st,ry=x*st+y*ct;
  return [w*.5+rx*scale,h*.33+ry*scale*.52-(z-r.datum)*scale*.60,ry];
 };
 c.save();c.beginPath();c.rect(0,48,w,h*.68);c.clip();
 // Plano de comparación de altura constante.
 const base=[[-half,-half],[half,-half],[half,half],[-half,half]].map(([x,y])=>project(x,y,r.datum));
 c.beginPath();base.forEach((pt,i)=>i?c.lineTo(pt[0],pt[1]):c.moveTo(pt[0],pt[1]));c.closePath();
 c.fillStyle='rgba(237,173,108,.045)';c.fill();c.setLineDash([5,5]);c.strokeStyle='rgba(255,187,115,.55)';c.lineWidth=1.1;c.stroke();c.setLineDash([]);
 type Cell={depth:number;poly:[number,number][];z:number};
 const cells:Cell[]=[];
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){
  const x=-half+i*dx,y=-half+j*dx;
  const pts:[[number,number],[number,number],[number,number],[number,number]]=[[x,y],[x+dx,y],[x+dx,y+dx],[x,y+dx]];
  const projected=pts.map(([a,b])=>project(a,b,terrainElevation(a,b,r.model,r.irregularity)));
  const average=pts.reduce((sum,[a,b])=>sum+terrainElevation(a,b,r.model,r.irregularity),0)/4;
  cells.push({depth:project(x+dx/2,y+dx/2,average)[2],poly:projected.map(v=>[v[0],v[1]]),z:average});
 }
 cells.sort((a,b)=>a.depth-b.depth);
 for(const cell of cells){
  const t=Math.max(0,Math.min(1,(cell.z-900)/550));
  const hue=186+t*42,light=23+t*30;
  c.beginPath();cell.poly.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();
  c.fillStyle='hsl('+hue.toFixed(1)+' 64% '+light.toFixed(1)+'%)';c.fill();
  c.strokeStyle='rgba(170,231,243,.18)';c.lineWidth=.65;c.stroke();
 }
 const pt=project(r.x,r.y,r.z);
 c.beginPath();c.arc(pt[0],pt[1],5,0,2*Math.PI);c.fillStyle='#ffce80';c.shadowColor='#ffb96f';c.shadowBlur=16;c.fill();c.shadowBlur=0;
 c.font='600 11px system-ui';c.fillStyle='#f5f1e7';c.fillText('P · '+r.z.toFixed(1)+' m',Math.min(w-120,pt[0]+10),Math.max(67,pt[1]-13));
 c.restore();
 // Perfil a y fijo: la misma función y el mismo punto que el volumen y la malla.
 const left=34,right=w-31,top=h*.79,bottom=h*.94;
 const profile:number[]=[];
 for(let i=0;i<=90;i++)profile.push(terrainElevation(-half+i*TERRAIN_EXTENT_M/90,r.y,r.model,r.irregularity));
 const lo=Math.min(r.datum,...profile)-25,hi=Math.max(r.datum,...profile)+25;
 const px=(x:number)=>left+(x+half)/TERRAIN_EXTENT_M*(right-left);
 const py=(z:number)=>bottom-(z-lo)/(hi-lo)*(bottom-top);
 c.font='600 10px ui-monospace,monospace';c.fillStyle='#9eafc8';c.fillText('PERFIL TOPOGRÁFICO  /  y = '+r.y.toFixed(0)+' m',left,top-12);
 c.strokeStyle='rgba(255,185,110,.64)';c.setLineDash([5,4]);c.beginPath();c.moveTo(left,py(r.datum));c.lineTo(right,py(r.datum));c.stroke();c.setLineDash([]);
 c.beginPath();profile.forEach((z,i)=>i?c.lineTo(left+i/90*(right-left),py(z)):c.moveTo(left,py(z)));
 c.strokeStyle='#8de8f2';c.shadowColor='#70e7f8';c.shadowBlur=7;c.lineWidth=2.4;c.stroke();c.shadowBlur=0;
 c.beginPath();c.arc(px(r.x),py(r.z),4,0,2*Math.PI);c.fillStyle='#ffd08a';c.fill();
 c.fillStyle='#718fa8';c.font='10px ui-monospace,monospace';c.fillText('−500 m',left,bottom+15);c.fillText('+500 m',right-45,bottom+15);
 c.fillStyle='#9dadc5';c.fillText('MODELO SINTÉTICO · SIN DEM REAL',w>330?w-230:11,Math.min(h-9,bottom+27));
}
