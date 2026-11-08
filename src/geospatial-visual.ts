import {projectGeographic,projectionDistortion,projectionNames,rasterInfo,rasterValue,syntheticSpectra,syntheticColor,sensorLabels,clip,DEG} from './geospatial';
import type {SceneId} from './content';

type Ctx=CanvasRenderingContext2D;
const line=(c:Ctx,x1:number,y1:number,x2:number,y2:number,color:string,width=1)=>{c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.stroke()};
const text=(c:Ctx,s:string,x:number,y:number,color='#afc5df',size=11)=>{c.fillStyle=color;c.font='600 '+size+'px ui-monospace, SFMono-Regular, monospace';c.fillText(s,x,y)};
const disk=(c:Ctx,x:number,y:number,r:number,col:string)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=col;c.fill()};
const within=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
function projection(c:Ctx,w:number,h:number,p:Record<string,number>){
 const mode=Math.round(p.projectionMode||0),lat=clip(p.probeLat??45,-75,75),lon=clip(p.probeLon??-60,-150,150);
 const leftX=w*.255,leftY=h*.49,R=Math.min(w*.19,h*.29),mx=w*.54,my=h*.24,mw=w*.405,mh=h*.51;
 c.strokeStyle='#627b9b';c.lineWidth=1.4;c.beginPath();c.arc(leftX,leftY,R,0,2*Math.PI);c.stroke();
 const globe=(lo:number,la:number):[number,number,boolean]=>{
  const lr=lo*DEG,pr=la*DEG,depth=Math.cos(pr)*Math.cos(lr);
  return [leftX+R*Math.cos(pr)*Math.sin(lr),leftY-R*Math.sin(pr),depth>=0];
 };
 // Only the near side of each great/small circle is visible.
 for(let la=-60;la<=60;la+=30){
  c.beginPath();let active=false;
  for(let lo=-90;lo<=90;lo+=2){const [x,y,show]=globe(lo,la);if(show){if(!active)c.moveTo(x,y);else c.lineTo(x,y);active=true}else active=false}
  c.strokeStyle='rgba(109,202,233,.35)';c.lineWidth=.9;c.stroke();
 }
 for(let lo=-90;lo<=90;lo+=30){
  c.beginPath();let active=false;
  for(let la=-85;la<=85;la+=2){const [x,y,show]=globe(lo,la);if(show){if(!active)c.moveTo(x,y);else c.lineTo(x,y);active=true}else active=false}
  c.strokeStyle='rgba(109,202,233,.35)';c.lineWidth=.9;c.stroke();
 }
 const gp=globe(lon,lat);if(gp[2]){disk(c,gp[0],gp[1],5,'#ffd18e');line(c,gp[0],gp[1],gp[0]+28,gp[1]-17,'#ffd18e',1.4)}
 text(c,'ESFERA (vista ecuatorial)',Math.max(12,leftX-R),leftY+R+28);
 c.fillStyle='#0d1930';c.fillRect(mx,my,mw,mh);c.strokeStyle='#48617c';c.strokeRect(mx,my,mw,mh);
 const maxY=mode===1?Math.abs(projectGeographic(0,80,mode)[1]):mode===2?1:Math.PI/2;
 const toScreen=(lo:number,la:number):[number,number]=>{
  const [x,y]=projectGeographic(lo,la,mode);
  return [mx+(x+Math.PI)/(2*Math.PI)*mw,my+mh/2-y/maxY*(mh*.46)];
 };
 c.save();c.beginPath();c.rect(mx,my,mw,mh);c.clip();
 for(let lo=-180;lo<=180;lo+=30){const a=toScreen(lo,-80),b=toScreen(lo,80);line(c,a[0],a[1],b[0],b[1],'rgba(138,168,218,.27)')}
 for(let la=-75;la<=75;la+=15){const a=toScreen(-180,la),b=toScreen(180,la);line(c,a[0],a[1],b[0],b[1],'rgba(138,168,218,.27)')}
 // Geodesic small circles, a conceptual Tissot indicatrix. Ellipse changes with projection.
 for(const latitude of [-60,-30,0,30,60]){
  const centerLon=latitude===lat?lon:0;
  c.beginPath();for(let j=0;j<=60;j++){
   const t=j*2*Math.PI/60;
   const la=latitude+5*Math.cos(t);
   const lo=centerLon+5*Math.sin(t)/Math.cos(latitude*DEG);
   const [x,y]=toScreen(lo,la);if(j===0)c.moveTo(x,y);else c.lineTo(x,y);
  }
  c.closePath();c.fillStyle=latitude===Math.round(lat/30)*30?'rgba(255,194,128,.16)':'rgba(114,224,233,.1)';c.fill();c.strokeStyle='rgba(117,225,239,.65)';c.stroke();
 }
 const pos=toScreen(lon,lat);disk(c,pos[0],pos[1],5,'#ffd08d');
 c.restore();
 text(c,projectionNames[mode]||projectionNames[0],mx,my-12,'#e5f2ff');
 const distort=projectionDistortion(lat,mode);
 text(c,'ESCALA DE ÁREA EN LAT '+lat.toFixed(0)+'°  ×'+distort.area.toFixed(2),mx,Math.min(h-37,my+mh+27),'#b6e9ed');
 text(c,'GRATICULA DIDÁCTICA · SIN COSTAS',mx,Math.min(h-18,my+mh+46),'#6e8aa8',9);
 text(c,'ESFERA → PLANO',w*.40,h*.10,'#85deda',12);
}
function raster(c:Ctx,w:number,h:number,p:Record<string,number>){
 const n=Math.round(p.rasterN||22),model=Math.round(p.rasterTerrain||0),rough=p.rasterRough??.8,mask=(p.rasterMask||0)>0;
 const s=rasterInfo(n,model,rough,mask,p.rasterX||0,p.rasterY||0);
 const size=Math.min(w*.68,h*.76),x=w*.5-size/2,y=h*.53-size/2,cell=size/n;
 c.fillStyle='#0b1628';c.fillRect(x-3,y-3,size+6,size+6);
 for(let j=0;j<n;j++)for(let i=0;i<n;i++){
  const z=rasterValue(n,i,j,model,rough,mask),level=z===null?0:clip((z-940)/510,0,1);
  c.fillStyle=z===null?'#080d1b':'hsl('+(188-level*139).toFixed(1)+' 56% '+(19+level*48).toFixed(1)+'%)';
  c.fillRect(x+i*cell,y+(n-1-j)*cell,cell+.35,cell+.35);
 }
 // Synthetic vector river & route do not influence raster numeric values.
 c.beginPath();for(let i=0;i<=100;i++){const a=i/100,xx=x+a*size,yy=y+size*(.58+.11*Math.sin(a*7));if(i===0)c.moveTo(xx,yy);else c.lineTo(xx,yy)}
 c.strokeStyle='#6de5ff';c.lineWidth=2.5;c.stroke();
 c.beginPath();for(let i=0;i<=100;i++){const a=i/100,xx=x+a*size,yy=y+size*(.34+a*.27);if(i===0)c.moveTo(xx,yy);else c.lineTo(xx,yy)}
 c.strokeStyle='#f7c28d';c.lineWidth=2;c.setLineDash([6,4]);c.stroke();c.setLineDash([]);
 const q=s.query,px=x+(q[0]+.5)*cell,py=y+(n-q[1]-.5)*cell;
 c.strokeStyle='#ffe6b2';c.lineWidth=1.7;c.strokeRect(x+q[0]*cell,y+(n-1-q[1])*cell,cell,cell);
 disk(c,px,py,Math.min(3.6,cell*.23),'#ffe6b2');
 c.strokeStyle='#9db4d1';c.lineWidth=.9;c.strokeRect(x,y,size,size);
 text(c,'RÁSTER · ELEVACIÓN SINTÉTICA',x,Math.max(16,y-14),'#d0f0ed');
 text(c,'● CAUCE  − − RUTA    □ PIXEL CONSULTADO',x,Math.min(h-13,y+size+23),'#b0c5de',9);
 text(c,'CELDA '+s.cell.toFixed(1)+' m  /  '+n+'×'+n,x,Math.min(h-30,y+size+43),'#80d9d9',10);
}
function sensors(c:Ctx,w:number,h:number,p:Record<string,number>){
 const mode=Math.round(p.sensorMode||0),n=Math.round(p.sensorN||32),dry=clip(p.sensorDryness||0,0,1);
 const size=Math.min(w*.69,h*.77),x=w*.5-size/2,y=h*.53-size/2,cell=size/n;
 const xy=(i:number,j:number):[number,number]=>[-500+(i+.5)*1000/n,-500+(j+.5)*1000/n];
 for(let j=0;j<n;j++)for(let i=0;i<n;i++){
  const [east,north]=xy(i,j),bands=syntheticSpectra(east,north,dry),color=syntheticColor(bands,mode);
  c.fillStyle='rgb('+color[0]+','+color[1]+','+color[2]+')';
  c.fillRect(x+i*cell,y+(n-1-j)*cell,cell+.4,cell+.4);
 }
 const px=clip((p.sensorX||0)/1000+.5,0,1),py=clip(.5-(p.sensorY||0)/1000,0,1);
 const gx=x+size*px,gy=y+size*py;
 c.beginPath();c.arc(gx,gy,6,0,Math.PI*2);c.strokeStyle='#ffffff';c.lineWidth=2;c.stroke();disk(c,gx,gy,2,'#ffffff');
 c.strokeStyle='#8292ad';c.strokeRect(x,y,size,size);
 text(c,(sensorLabels[mode]||sensorLabels[0]).toUpperCase(),x,Math.max(17,y-14),'#d0f0ed');
 text(c,'SENSOR MULTIESPECTRAL SIMULADO',x,Math.min(h-28,y+size+25),'#98b5d0');
 text(c,'REFLECTANCIA IDEALIZADA · NO LANDSAT REAL',x,Math.min(h-11,y+size+44),'#778fa9',9);
}
export function drawGeospatialScene(c:Ctx,w:number,h:number,scene:SceneId,p:Record<string,number>){
 if(scene==='projection'){projection(c,w,h,p);return}
 if(scene==='raster'){raster(c,w,h,p);return}
 if(scene==='sensors'){sensors(c,w,h,p);return}
}
