import {at,interpolateDem,type DemGrid} from './real-dem';
import {terrainContours} from './terrain-geometry';

export function drawSampledDEM(c:CanvasRenderingContext2D,w:number,h:number,grid:DemGrid,p:Record<string,number>){
 const i=Math.max(0,Math.min(8,Math.round(p.demX||0))),j=Math.max(0,Math.min(8,Math.round(p.demY||0)));
 const datum=p.demDatum??2500,interval=Math.max(20,p.demContours||50);
 const size=Math.min(w*.74,h*.56),x0=(w-size)/2,y0=Math.max(75,(h*.74-size)/2);
 const cell=size/(grid.n-1),span=Math.max(1,grid.max-grid.min);
 c.fillStyle='#081625';c.fillRect(x0-2,y0-2,size+4,size+4);
 for(let row=0;row<grid.n-1;row++)for(let col=0;col<grid.n-1;col++){
  const corners=[at(grid,col,row),at(grid,col+1,row),at(grid,col,row+1),at(grid,col+1,row+1)];
  const valid=corners.filter((z):z is number=>z!==null);
  if(valid.length!==4){c.fillStyle='#151c30';c.fillRect(x0+col*cell,y0+row*cell,cell+.5,cell+.5);continue}
  const z=valid.reduce((a,b)=>a+b,0)/4,ratio=(z-grid.min)/span;
  c.fillStyle='hsl('+(197-151*ratio).toFixed(0)+' 55% '+(23+35*ratio).toFixed(0)+'%)';
  c.fillRect(x0+col*cell,y0+row*cell,cell+.6,cell+.6);
 }
 c.save();c.beginPath();c.rect(x0,y0,size,size);c.clip();
 if(grid.noData===0){
  const contours:number[]=[];
  for(let z=Math.ceil(grid.min/interval)*interval;z<grid.max;z+=interval)contours.push(z);
  const lines=terrainContours((x,y)=>interpolateDem(grid,x,y),8,contours);
  for(const entry of lines){
   c.strokeStyle=entry.level%100===0?'rgba(251,245,224,.88)':'rgba(212,241,249,.57)';
   c.lineWidth=entry.level%100===0?1.55:1.05;c.beginPath();
   for(const [a,b] of entry.segments){
    c.moveTo(x0+(a[0]+500)/1000*size,y0+(500-a[1])/1000*size);
    c.lineTo(x0+(b[0]+500)/1000*size,y0+(500-b[1])/1000*size);
   }c.stroke();
  }
 }
 // Sampling vertices visible as discrete measurements, not invented continuous pixels.
 for(let row=0;row<grid.n;row++)for(let col=0;col<grid.n;col++){
  const z=at(grid,col,row);
  c.beginPath();c.arc(x0+col*cell,y0+row*cell,z===null?2:1.6,0,2*Math.PI);
  c.fillStyle=z===null?'#ef7897':'rgba(242,250,255,.65)';c.fill();
 }
 const px=x0+i*cell,py=y0+j*cell;
 c.strokeStyle='#ffe0a5';c.lineWidth=1.7;c.beginPath();c.moveTo(x0,py);c.lineTo(x0+size,py);c.stroke();
 c.beginPath();c.arc(px,py,5,0,2*Math.PI);c.fillStyle='#ffd99d';c.fill();
 c.restore();c.strokeStyle='#5f829a';c.lineWidth=1;c.strokeRect(x0,y0,size,size);
 c.font='600 11px ui-monospace, monospace';c.fillStyle='#cee5ef';
 c.fillText('SRTM 90 m  ·  MUESTRAS REALES',x0,Math.max(35,y0-17));
 c.font='10px ui-monospace, monospace';c.fillStyle='#92adbf';
 c.fillText('San Juan · WGS84 / EGM96',x0,Math.min(h-80,y0+size+18));
 // Cross-section of actual collected grid nodes, no fabricated values between them.
 const left=30,right=w-30,top=Math.max(y0+size+48,h*.78),bottom=h*.925;
 const samples=Array.from({length:grid.n},(_,k)=>at(grid,k,j));
 c.fillStyle='rgba(9,22,36,.95)';c.fillRect(left-10,top-26,right-left+20,bottom-top+44);
 c.strokeStyle='#406177';c.lineWidth=1;c.strokeRect(left-10,top-26,right-left+20,bottom-top+44);
 c.font='600 10px ui-monospace,monospace';c.fillStyle='#f1f6ff';c.fillText('PERFIL MUESTREADO  ·  lat '+grid.points[j*grid.n].lat.toFixed(4)+'°',left,top-9);
 const hmin=Math.min(grid.min,datum)-35,hmax=Math.max(grid.max,datum)+35;
 const yVal=(z:number)=>bottom-(z-hmin)/(hmax-hmin)*(bottom-top);
 c.setLineDash([5,4]);c.strokeStyle='rgba(255,191,137,.6)';c.beginPath();c.moveTo(left,yVal(datum));c.lineTo(right,yVal(datum));c.stroke();c.setLineDash([]);
 c.beginPath();let active=false;
 samples.forEach((z,k)=>{if(z===null){active=false;return}const x=left+(right-left)*k/8;active?c.lineTo(x,yVal(z)):c.moveTo(x,yVal(z));active=true});
 c.strokeStyle='#85ddf4';c.lineWidth=2.2;c.stroke();
 const picked=samples[i];if(picked!==null){
  c.beginPath();c.arc(left+(right-left)*i/8,yVal(picked),4.1,0,2*Math.PI);c.fillStyle='#ffdfaf';c.fill();
 }
 c.font='10px ui-monospace,monospace';c.fillStyle='#91acc0';
 c.fillText('DATOS REALES INTERPOLADOS · NO GeoTIFF ORIGINAL',left,Math.min(h-7,bottom+27));
}
