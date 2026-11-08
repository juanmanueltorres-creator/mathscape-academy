import {TERRAIN_EXTENT_M,terrainElevation,terrainReport} from './terrain';
import {terrainContours,terrainField} from './terrain-geometry';

/** Map view uses exactly the same synthetic elevation function as the 3D mesh and volume integration. */
export function drawTerrainContours(c:CanvasRenderingContext2D,w:number,h:number,p:Record<string,number>){
 const t=terrainReport(p),n=t.n,side=Math.min(w*.74,h<450?h*.50:h*.56),x0=w/2-side/2,y0=Math.max(65,(h*.72-side)/2),step=side/n;
 const field=terrainField(t.model,t.irregularity);
 const contours=[...Array(Math.max(0,Math.ceil((t.fine.max-t.fine.min)/Math.max(10,p.contourStep||50))+1)).keys()]
  .map(i=>Math.floor(t.fine.min/(p.contourStep||50))*(p.contourStep||50)+i*(p.contourStep||50))
  .filter(v=>v>=t.fine.min&&v<=t.fine.max);
 const min=t.fine.min,max=t.fine.max,diff=Math.max(1,max-min);
 c.save();c.beginPath();c.rect(x0,y0,side,side);c.clip();
 for(let j=0;j<n;j++)for(let i=0;i<n;i++){
  const xx=-500+(i+.5)*TERRAIN_EXTENT_M/n,yy=500-(j+.5)*TERRAIN_EXTENT_M/n;
  const z=terrainElevation(xx,yy,t.model,t.irregularity);
  const u=(z-min)/diff;
  c.fillStyle='hsl('+(200-100*u).toFixed(1)+' 43% '+(18+39*u).toFixed(1)+'%)';
  c.fillRect(x0+i*step,y0+j*step,step+.5,step+.5);
 }
 const to=(pt:readonly [number,number]):readonly [number,number]=>[x0+(pt[0]+500)/1000*side,y0+(500-pt[1])/1000*side];
 const shapes=terrainContours(field,n,contours);
 c.lineWidth=1.15;
 for(let idx=0;idx<shapes.length;idx++){
  const level=shapes[idx],highlight=idx%2===0;
  c.strokeStyle=highlight?'rgba(238,242,255,.66)':'rgba(192,222,238,.37)';
  c.lineWidth=highlight?1.4:0.9;c.beginPath();
  for(const [a,b] of level.segments){const [ax,ay]=to(a),[bx,by]=to(b);c.moveTo(ax,ay);c.lineTo(bx,by)}
  c.stroke();
 }
 // Profile line y=selected y is the same cross-section used in the profile graph.
 const sectionY=y0+(500-t.y)/1000*side;
 c.setLineDash([5,4]);c.strokeStyle='rgba(255,193,129,.82)';c.lineWidth=1.25;
 c.beginPath();c.moveTo(x0,sectionY);c.lineTo(x0+side,sectionY);c.stroke();c.setLineDash([]);
 const px=x0+(t.x+500)/1000*side,py=y0+(500-t.y)/1000*side;
 c.beginPath();c.arc(px,py,5,0,2*Math.PI);c.fillStyle='#ffe0aa';c.fill();
 c.restore();
 c.strokeStyle='#6d9bb0';c.lineWidth=1;c.strokeRect(x0,y0,side,side);
 c.font='600 10px ui-monospace,monospace';c.fillStyle='#d8edf5';
 c.fillText('CURVAS DE NIVEL · '+(p.contourStep||50)+' m',x0,Math.max(46,y0-12));
 c.fillStyle='#91a8c5';c.fillText('MAPA PLANO SINTÉTICO · 1 km × 1 km',x0,Math.min(h-80,y0+side+18));
 // A legible cross-section in its own panel: same y as highlighted map transect.
 const l=28,r=w-28,top=Math.max(y0+side+30,h*.755),bottom=h*.925,values:number[]=[];
 for(let i=0;i<=100;i++)values.push(field(-500+i*10,t.y));
 const bottomZ=Math.min(t.datum,...values)-20,topZ=Math.max(t.datum,...values)+20;
 const scaleY=(z:number)=>bottom-(z-bottomZ)/(topZ-bottomZ)*(bottom-top);
 c.fillStyle='rgba(9,23,39,.94)';c.fillRect(l-11,top-27,r-l+22,bottom-top+38);
 c.strokeStyle='rgba(121,162,195,.45)';c.lineWidth=1;c.strokeRect(l-11,top-27,r-l+22,bottom-top+38);
 c.font='600 10px ui-monospace,monospace';c.fillStyle='#e2f3ff';c.fillText('PERFIL TOPOGRÁFICO  /  y='+t.y.toFixed(0)+' m',l,top-11);
 c.strokeStyle='rgba(255,189,115,.7)';c.setLineDash([5,4]);c.beginPath();c.moveTo(l,scaleY(t.datum));c.lineTo(r,scaleY(t.datum));c.stroke();c.setLineDash([]);
 c.strokeStyle='#8ce5f5';c.lineWidth=2.5;c.shadowBlur=7;c.shadowColor='#6ad4f9';c.beginPath();
 for(let i=0;i<values.length;i++){const x=l+(r-l)*i/100,y=scaleY(values[i]);if(i===0)c.moveTo(x,y);else c.lineTo(x,y)}
 c.stroke();c.shadowBlur=0;
 const pickedX=l+(t.x+500)/1000*(r-l),pickedY=scaleY(t.z);
 c.beginPath();c.arc(pickedX,pickedY,4,0,2*Math.PI);c.fillStyle='#ffdda3';c.fill();
 c.font='9px ui-monospace,monospace';c.fillStyle='#93acc9';
 c.fillText('−500 m',l,Math.min(h-8,bottom+17));c.fillText('+500 m',r-44,Math.min(h-8,bottom+17));
 if(h>470){c.fillStyle='#8da9bd';c.fillText('ISOALTITUD · MODELO SINTÉTICO',l,bottom+29)}
}
