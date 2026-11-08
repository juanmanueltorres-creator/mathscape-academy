import type {SceneId} from './content';
import {drawGeospatialScene} from './geospatial-visual';
import {drawTerrainLayer} from './terrain-visual';
import {drawTerrainContours} from './terrain-contour-visual';
import {applyMatrix,determinant,lorenzPoints,superRadius,surface,familyValue,familyAnchor,derivativeExample,derivativeExampleSlope,integrandExample,solidHeight,gradientExampleValue,gradientExample,limitExample,limitCenter,odeModelExact,odeModelRate,solveEulerModel,type Vec2,type Vec3} from './math';

export type ViewState={angle:number;time:number;pointer?:Vec2;focus?:'lissajous'|'lorenz'|'gielis'};
type Paint={c:CanvasRenderingContext2D;w:number;h:number;d:number;cx:number;cy:number;accent:string};
let orbit:Vec3[]|null=null;
const getOrbit=()=>orbit??(orbit=lorenzPoints(3300));
const rgba=(hex:string,alpha:number)=>{
 const h=hex.replace('#','');const n=parseInt(h,16);
 return `rgba(${n>>16&255},${n>>8&255},${n&255},${alpha})`;
};
function line(p:Paint,a:Vec2,b:Vec2,color:string,width=1,blur=0){
 const {c}=p;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.strokeStyle=color;c.lineWidth=width;c.shadowColor=color;c.shadowBlur=blur;c.stroke();c.shadowBlur=0;
}
function dot(p:Paint,a:Vec2,r:number,color:string){const {c}=p;c.beginPath();c.arc(...a,r,0,Math.PI*2);c.fillStyle=color;c.shadowBlur=18;c.shadowColor=color;c.fill();c.shadowBlur=0}
function label(p:Paint,text:string,x:number,y:number,color='#8497b9',size=11){p.c.font=`${size}px ui-monospace, SFMono-Regular, monospace`;p.c.fillStyle=color;p.c.fillText(text,x,y)}
function path(p:Paint,points:Vec2[],color:string,width=2,glow=0){if(!points.length)return;const c=p.c;c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.strokeStyle=color;c.lineWidth=width;c.shadowColor=color;c.shadowBlur=glow;c.stroke();c.shadowBlur=0}
function polygon(p:Paint,points:Vec2[],fill:string,stroke?:string){const {c}=p;c.beginPath();points.forEach((v,i)=>i?c.lineTo(...v):c.moveTo(...v));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.8;c.stroke()}}
function grid(p:Paint,scale:number,origin:Vec2,units=5){
 const {c,w,h}=p;const xy=(x:number,y:number):Vec2=>[origin[0]+x*scale,origin[1]-y*scale];
 c.save();c.beginPath();c.rect(0,0,w,h);c.clip();
 for(let i=-20;i<=20;i++){
  const a=xy(i,-20),b=xy(i,20),d=xy(-20,i),e=xy(20,i);
  line(p,a,b,i===0?'#546986':'#29344a92',i===0?1.25:.65);
  line(p,d,e,i===0?'#546986':'#29344a92',i===0?1.25:.65);
  if(i!==0 && Math.abs(i)<=units){label(p,String(i),xy(i,0)[0]+3,origin[1]+14,'#5f7293',10);label(p,String(i),origin[0]+6,xy(0,i)[1]-5,'#5f7293',10)}
 }
 c.restore();label(p,'x',w-23,origin[1]-11,'#8c9db9',11);label(p,'y',origin[0]+10,17,'#8c9db9',11);
 return xy;
}
function curve(p:Paint,xy:(x:number,y:number)=>Vec2,fun:(x:number)=>number,color:string,xmin=-5,xmax=5,width=2.8,skip?:(x:number)=>boolean){
 const c=p.c;c.beginPath();let started=false;let previous:Vec2|null=null;
 for(let i=0;i<=480;i++){
  const x=xmin+(xmax-xmin)*i/480, y=fun(x);
  if(!Number.isFinite(y)||Math.abs(y)>1e4||(skip&&skip(x))){started=false;previous=null;continue}
  const q=xy(x,y);
  if(q[1]<-p.h*2||q[1]>p.h*3){started=false;previous=null;continue}
  if(!started||previous&&Math.abs(q[1]-previous[1])>p.h*.8){c.moveTo(...q);started=true}else c.lineTo(...q);previous=q;
 }
 c.strokeStyle=color;c.lineWidth=width;c.shadowColor=color;c.shadowBlur=10;c.stroke();c.shadowBlur=0;
}
function arrow(p:Paint,a:Vec2,b:Vec2,color:string,width=3){
 line(p,a,b,color,width,8);const th=Math.atan2(b[1]-a[1],b[0]-a[0]);const l=10;
 polygon(p,[b,[b[0]-l*Math.cos(th-.5),b[1]-l*Math.sin(th-.5)],[b[0]-l*Math.cos(th+.5),b[1]-l*Math.sin(th+.5)]],color);
}
const project=(p:Paint,angle:number,scale:number,x:number,y:number,z:number,offset=0):Vec2=>{
 const u=x*Math.cos(angle)-y*Math.sin(angle),v=x*Math.sin(angle)+y*Math.cos(angle);
 return [p.cx+u*scale,p.cy+offset+v*scale*.45-z*scale*.50];
};
/** Superficies de revolución: dibujadas sobre disco real, no sobre un cuadrado. */
function diskSolid(p:Paint,pr:Record<string,number>,angle:number){
 const model=Math.round(pr.doubleModel||0),R=pr.bound,H=pr.height;
 const radials=p.w<600?10:16,angular=p.w<600?32:48;
 const scl=Math.min(p.w*.31,p.h*.31)/Math.max(R,1);
 const proj=(x:number,y:number,z:number):Vec2=>project(p,angle,scl,x,y,z,52);
 // Disco de integración; las partes del fondo se muestran como una sombra translúcida.
 const ground:Vec2[]=[];for(let j=0;j<=angular;j++){const a=j*2*Math.PI/angular;ground.push(proj(R*Math.cos(a),R*Math.sin(a),0))}
 polygon(p,ground,'#3d5d811e','#8ea1d266');
 if(model===5){
  // La esfera completa es la unión de las dos hojas z=±√(R²−x²−y²).
  // La integral usa su ESPESOR, no el área de una sola hoja.
  const upper:{pts:Vec2[];depth:number;light:number}[]=[],lower:{pts:Vec2[];depth:number;light:number}[]=[];
  for(let i=0;i<radials;i++)for(let j=0;j<angular;j++){
   const r0=i*R/radials,r1=(i+1)*R/radials,a=j*2*Math.PI/angular,b=(j+1)*2*Math.PI/angular;
   const coords:[[number,number],[number,number],[number,number],[number,number]]=[
    [r0*Math.cos(a),r0*Math.sin(a)],[r1*Math.cos(a),r1*Math.sin(a)],[r1*Math.cos(b),r1*Math.sin(b)],[r0*Math.cos(b),r0*Math.sin(b)]];
   const top=coords.map(([x,y])=>Math.sqrt(Math.max(0,R*R-x*x-y*y)));
   const depth=((r0+r1)/2)*Math.cos((a+b)/2-angle),light=1-r0/R;
   upper.push({pts:coords.map(([x,y],k)=>proj(x,y,top[k])),depth,light});
   lower.push({pts:coords.map(([x,y],k)=>proj(x,y,-top[k])),depth,light});
  }
  lower.sort((a,b)=>a.depth-b.depth);upper.sort((a,b)=>a.depth-b.depth);
  for(const q of lower)polygon(p,q.pts,`rgba(74,105,182,${.35+q.light*.14})`,'#a6c2ff19');
  for(const q of upper)polygon(p,q.pts,`rgba(102,177,232,${.65+q.light*.15})`,'#defaff20');
  path(p,ground,'#e3c5fd77',1.1);
  label(p,'ESFERA COMPLETA · 2 HEMISFERIOS',20,p.h-52,'#e1e9ff');
  label(p,`D: x² + y² ≤ ${R.toFixed(2)}²`,20,p.h-72,'#8baed3');
  label(p,'arrastra ↔ para girar',p.w-190,p.h-52,'#899bb8');return;
 }
 // Pared lateral para la superficie z=H y para los otros sólidos (volumen debajo de z).
 const walls:{pts:Vec2[];depth:number}[]=[];
 for(let j=0;j<angular;j++){
  const a=j*2*Math.PI/angular,b=(j+1)*2*Math.PI/angular;
  const x=R*Math.cos(a),y=R*Math.sin(a),u=R*Math.cos(b),v=R*Math.sin(b);
  const z=solidHeight(model,x,y,R,H,pr.amplitude),w=solidHeight(model,u,v,R,H,pr.amplitude);
  if(z<1e-6&&w<1e-6)continue;
  walls.push({pts:[proj(x,y,0),proj(u,v,0),proj(u,v,w),proj(x,y,z)],depth:Math.sin((a+b)/2+angle)});
 }
 walls.sort((a,b)=>a.depth-b.depth);
 for(const wall of walls)polygon(p,wall.pts,'#5b88c945','#99d9ff42');
 const tiles:{pts:Vec2[];depth:number;height:number}[]=[];
 for(let i=0;i<radials;i++){
  const r0=i*R/radials,r1=(i+1)*R/radials;
  for(let j=0;j<angular;j++){
   const a=j*2*Math.PI/angular,b=(j+1)*2*Math.PI/angular;
   const coords:[[number,number],[number,number],[number,number],[number,number]]=[
     [r0*Math.cos(a),r0*Math.sin(a)], [r1*Math.cos(a),r1*Math.sin(a)],
     [r1*Math.cos(b),r1*Math.sin(b)], [r0*Math.cos(b),r0*Math.sin(b)]
   ];
   const z=coords.map(([x,y])=>solidHeight(model,x,y,R,H,pr.amplitude));
   const mid=(a+b)/2,rm=(r0+r1)/2;
   tiles.push({pts:coords.map(([x,y],k)=>proj(x,y,z[k])),depth:rm*Math.cos(mid-angle),height:solidHeight(model,rm*Math.cos(mid),rm*Math.sin(mid),R,H,pr.amplitude)});
  }
 }
 tiles.sort((a,b)=>a.depth-b.depth);
 const zmax=model===2?R:H;
 for(const tile of tiles){
   const light=Math.min(1,Math.max(0,tile.height/Math.max(zmax,.01)));
   const fill=`rgba(${Math.round(55+75*light)},${Math.round(137+61*light)},${Math.round(205+50*light)},.71)`;
   polygon(p,tile.pts,fill,'#c3f2ff2d');
 }
 // Rim inferior y altura; los rótulos no interceptan la geometría.
 path(p,ground,'#ffc89370',1.15);
 label(p,model===2?'HEMISFERIO':model===1?'CILINDRO':model===3?'PARABOLOIDE':'CONO',20,p.h-52,'#e1e9ff');
 label(p,`D: x² + y² ≤ ${R.toFixed(2)}²`,20,p.h-72,'#8baed3');
 label(p,'arrastra ↔ para girar',p.w-190,p.h-52,'#899bb8');
}
function surface3D(p:Paint,scene:SceneId,pr:Record<string,number>,angle:number){
 if(scene==='double'&&Math.round(pr.doubleModel||0)!==0){diskSolid(p,pr,angle);return}

 const b=scene==='double'?pr.bound:1.7,n=scene==='double'?Math.max(12,Math.min(pr.resolution*2,38)):28;
 const coeff=scene==='double'?pr.amplitude:pr.ga;
 const other=scene==='double'?pr.amplitude:pr.gb;
 const f=(x:number,y:number)=>scene==='double'?surface(x,y,coeff):gradientExampleValue(Math.round(pr.gradientModel||0),coeff,other,x,y)+.6;
 const scl=Math.min(p.w*.30,p.h*.34)/Math.max(b,.75);
 const proj=(x:number,y:number,z:number)=>project(p,angle,scl,x,y,z,35);
 const shade=(z:number)=>{
  const t=Math.min(1,z/4.3);return scene==='double'?`rgba(${Math.round(79+t*90)},${Math.round(142+t*55)},255,0.53)`:`rgba(${Math.round(74+t*65)},${Math.round(192+t*35)},${Math.round(174+t*55)},0.50)`;
 };
 const quads:{pts:Vec2[];depth:number;x:number;y:number;z:number}[]=[];
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){
  const x=-b+2*b*i/n,y=-b+2*b*j/n,dx=2*b/n;
  const midX=x+dx/2,midY=y+dx/2;
  const pts=[proj(x,y,f(x,y)),proj(x+dx,y,f(x+dx,y)),proj(x+dx,y+dx,f(x+dx,y+dx)),proj(x,y+dx,f(x,y+dx))];
  quads.push({pts,depth:midX*Math.sin(angle)+midY*Math.cos(angle),x:midX,y:midY,z:f(midX,midY)});
 }
 // Geometría basada en superficie z=f(x,y), ordenada por distancia proyectada.
 quads.sort((u,v)=>u.depth-v.depth);
 for(let i=0;i<quads.length;i++){
  const q=quads[i];polygon(p,q.pts,shade(q.z),i%2===0?'#b5e6ff24':'#8190bd20');
 }
 // Borde del dominio base, conservando la correspondencia con [-b,b]².
 const floor:[number,number][]= [[-b,-b],[b,-b],[b,b],[-b,b]];
 polygon(p,floor.map(([x,y])=>proj(x,y,0)),'#6482b314','#94a6d055');
 for(let i=0;i<4;i++){
  const [x,y]=floor[i];line(p,proj(x,y,0),proj(x,y,f(x,y)),rgba(p.accent,.55),1.1);
 }
 if(scene==='double'){
  const r=Math.min(pr.resolution,10),step=2*b/r;
  // Prismas de Riemann en un área muy acotada (sin introducir una segunda función).
  if(r<=10)for(let i=0;i<r;i++)for(let j=0;j<r;j++){
   const x=-b+i*step,y=-b+j*step,z=f(x+step/2,y+step/2),base=proj(x+step/2,y+step/2,0),top=proj(x+step/2,y+step/2,z);
   line(p,base,top,rgba('#ffd09b',.12),.65);
  }
  label(p,`R = [-${b.toFixed(1)},${b.toFixed(1)}] × [-${b.toFixed(1)},${b.toFixed(1)}]`,23,p.h-100,'#bdc9e6');
  label(p,`${Math.round(pr.resolution**2)} celdas / puntos medios`,23,p.h-121,'#9baec9');
 }else{
  const x=pr.gx,y=pr.gy,z=f(x,y);
  const g=gradientExample(Math.round(pr.gradientModel||0),coeff,other,x,y);
  dot(p,proj(x,y,z),6,'#ffe0a2');
  arrow(p,proj(x,y,0),proj(x+g[0]*.35,y+g[1]*.35,0),'#e5b1ff',2.5);
  line(p,proj(x,y,0),proj(x,y,z),'#fce0ac99',1.4);
  label(p,`∇f = (${g[0].toFixed(2)}, ${g[1].toFixed(2)})`,23,p.h-101,'#dce5ff');
 }
 label(p,'arrastra para rotar',p.w-175,p.h-100,'#7f90b4');
}
function atlas(p:Paint,pr:Record<string,number>,view:ViewState){
 const c=p.c,focus=view.focus||'lissajous',t=view.time;
 const base=Math.min(p.w,p.h)*.34,compact=p.w<700;
 c.save();c.globalCompositeOperation='lighter';
 if(focus==='gielis'){
  const layers=compact?12:19,points=compact?110:160;
  for(let layer=0;layer<layers;layer++){
   const pts:Vec2[]=[],phase=layer*.14+t*.18,m=pr.gielisSymmetry+layer%2,rad=base*(.8+layer/75);
   for(let i=0;i<=points;i++){
    const th=i/points*2*Math.PI,rr=Math.min(2.4,superRadius(th+phase,m,pr.gielisExponent));
    pts.push([p.cx+Math.cos(th+view.angle*.24)*rad*rr*.8,p.cy+Math.sin(th)*rad*rr*.46+Math.sin(3*th+phase)*16]);
   }
   path(p,pts,rgba(['#8ce5ef','#bba1ff','#ffc78c'][layer%3],layer%6===0?.5:.22),layer%6===0?1.3:.8,layer%6===0?6:0);
  }
 }else if(focus==='lissajous'){
  const pts:Vec2[]=[],samples=compact?350:650;
  for(let i=0;i<=samples;i++){
   const th=i/samples*2*Math.PI;
   pts.push([p.cx+Math.sin(pr.freqA*th+pr.phase+t*.3)*base*.92,p.cy+Math.sin(pr.freqB*th+t*.12)*base*.78]);
  }
  path(p,pts,'#83e9ff',2.2,11);
 }else{
  const pts=getOrbit(),az=view.angle*.43+t*.12*pr.lorenzSpeed;
  c.beginPath();let first=true;
  for(let i=0;i<pts.length;i+=compact?2:1){
   const [x,y,z]=pts[i],rx=x*Math.cos(az)-y*Math.sin(az),ry=x*Math.sin(az)+y*Math.cos(az);
   const xx=p.cx+rx*base/27,yy=p.cy+(ry*.5-(z-24)*.7)*base/30;
   if(first){c.moveTo(xx,yy);first=false}else c.lineTo(xx,yy);
  }
  c.lineWidth=1.5;c.strokeStyle='#b9a6ff';c.shadowBlur=10;c.shadowColor='#b9a6ff';c.stroke();c.shadowBlur=0;
 }
 // Un único trazado para las partículas, sin costoso shadowBlur por punto.
 c.beginPath();const count=compact?55:85;
 for(let i=0;i<count;i++){
  const th=i*2.39996+t*.03,dist=Math.sqrt(i/count)*base*1.25;
  const x=p.cx+Math.cos(th)*dist,y=p.cy+Math.sin(th)*dist*.75;
  c.moveTo(x+1.1,y);c.arc(x,y,1.1,0,Math.PI*2);
 }
 c.fillStyle='rgba(195,214,255,.42)';c.fill();c.restore();
 label(p,focus==='lissajous'?'LISSAJOUS / ÓRBITAS ARMÓNICAS':focus==='lorenz'?'LORENZ / ATRACTOR CAÓTICO':'GIELIS / SUPERFÓRMULA',24,p.h-100,'#bac9e5');
 label(p,focus==='lissajous'?`${pr.freqA}:${pr.freqB}  ·  δ=${pr.phase.toFixed(2)}`:'Experimentá con el movimiento y la rotación',24,p.h-120,'#8fadc9');
}

export function drawScene(canvas:HTMLCanvasElement,scene:SceneId,pr:Record<string,number>,view:ViewState,accent:string){
 const rect=canvas.getBoundingClientRect();if(rect.width===0||rect.height===0)return;
 const w=rect.width,h=rect.height;
 // DPR adaptativo: prioriza nitidez legible sin multiplicar por cuatro los píxeles en Retina.
 const d=Math.min(window.devicePixelRatio||1,w<700?1.25:1.6);
 if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(h*d)}
 const c=canvas.getContext('2d');if(!c)return;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);
 const p:Paint={c,w,h,d,cx:w*.52,cy:h*.51,accent};
 // Glow ambiental discreto. No afecta la relación matemática de los gráficos.
 const glow=c.createRadialGradient(p.cx,p.cy,10,p.cx,p.cy,Math.max(w,h)*.6);
 glow.addColorStop(0,rgba(accent,.10));glow.addColorStop(1,'#00000000');c.fillStyle=glow;c.fillRect(0,0,w,h);
 if(scene==='projection'||scene==='raster'||scene==='sensors'){drawGeospatialScene(c,w,h,scene,pr);return}
 if(scene==='terrain'){if(Math.round(pr.terrainView||0)===1)drawTerrainContours(c,w,h,pr);else drawTerrainLayer(c,w,h,pr,view.angle);return}
 if(scene==='atlas'){atlas(p,pr,view);return}
 if(scene==='double'||scene==='gradient'){surface3D(p,scene,pr,view.angle);return}
 const span=scene==='ode'?5.0:scene==='integral'?4.9:4.15;
 const scale=Math.min(w/(span*2.25),h/(span*2.25));
 const xy=grid(p,scale,[scene==='integral'?w*.35:scene==='ode'?w*.14:p.cx,scene==='integral'?h*.79:scene==='ode'?h*.86:p.cy]);
 c.save();c.beginPath();c.rect(0,0,w,h);c.clip();
 if(scene==='functions'){
  const family=Math.max(0,Math.min(4,Math.round(pr.family||0)));
  const fn=(x:number)=>familyValue(family,x,pr.fa,pr.fb,pr.fc);
  curve(p,xy,x=>Math.sin(x)*.5,'#d1a5ff55',-5,5,1.2);
  curve(p,xy,fn,'#82dcff',-5,5,3);
  const anchor=familyAnchor(family,pr.fb),val=fn(anchor);
  if(Number.isFinite(val))dot(p,xy(anchor,val),5,'#ffcb85');
  if(family>=3){
   const top=xy(pr.fb,5),bottom=xy(pr.fb,-5);
   c.save();c.setLineDash([6,6]);line(p,top,bottom,'#ffb58899',1.2);c.restore();
  }
  label(p,'— familia activa',23,h-96,'#85deff');label(p,'— seno de referencia',23,h-116,'#c5a9fb');
 }
 if(scene==='limits'){
  const model=Math.round(pr.limitModel||0),f=(x:number)=>limitExample(model,x),center=limitCenter(model),h=pr.lh;
  if(model===2){
   curve(p,xy,f,'#83def5',-4,-.001,2.8);curve(p,xy,f,'#83def5',0,4,2.8);
   const hole=xy(0,-1);c.beginPath();c.arc(...hole,5,0,Math.PI*2);c.strokeStyle='#c9e8ff';c.lineWidth=2;c.stroke();dot(p,xy(0,1),5,'#ffb77a');
  }else{
   curve(p,xy,f,'#83def5',-4.5,4.5,2.7,x=>Math.abs(x-center)<.009);
   dot(p,xy(center+h,f(center+h)),5,'#ffc77d');dot(p,xy(center-h,f(center-h)),5,'#ffc77d');
   const y=model===1?2:1;
   c.beginPath();c.arc(...xy(center,y),6,0,Math.PI*2);c.strokeStyle='#ffffff';c.lineWidth=2;c.stroke();
   label(p,`hueco en (${center},${y})`,xy(center,y)[0]+11,xy(center,y)[1]-13,'#e9f3ff');
  }
 }
 if(scene==='derivative'){
  const model=Math.round(pr.derivativeModel||0),f=(x:number)=>derivativeExample(model,x);
  curve(p,xy,f,'#6edbea',-4,4,3);
  const x0=pr.x0,hp=pr.h,ms=(f(x0+hp)-f(x0))/hp,mt=derivativeExampleSlope(model,x0),y0=f(x0);
  curve(p,xy,x=>y0+mt*(x-x0),'#c5a0ff',-4,4,1.8);
  curve(p,xy,x=>y0+ms*(x-x0),'#ffbd77',-4,4,2);
  dot(p,xy(x0,y0),5,'#75e3ff');dot(p,xy(x0+hp,f(x0+hp)),5,'#ffb973');
  label(p,'secante',23,h-116,'#ffc487');label(p,'tangente',23,h-96,'#cbb2ff');
 }
 if(scene==='integral'){
  const b=pr.upper,n=Math.round(pr.n),dx=b/n,model=Math.round(pr.integralModel||0);
  const f=(x:number)=>integrandExample(model,x);
  for(let i=0;i<n;i++){
   const x=i*dx,y=f(x),a=xy(x,0),top=xy(x+dx,y);
   c.fillStyle='#fbb76b3c';c.strokeStyle='#ffc28b8a';c.lineWidth=.8;
   c.fillRect(a[0],top[1],dx*scale,y*scale);
   c.strokeRect(a[0],top[1],dx*scale,y*scale);
  }
  curve(p,xy,f,'#79ddf5',0,3.7,3);
  line(p,xy(b,0),xy(b,f(b)),'#e4afffb3',1.4);dot(p,xy(b,f(b)),4,'#ffd18e');
  label(p,`${n} rectángulos · suma izquierda`,23,h-101,'#fbd1a2');
 }
 if(scene==='matrix'){
  const mat:[number,number,number,number]=[pr.ma,pr.mb,pr.mc,pr.md];
  for(let k=-3;k<=3;k++){
   const u=applyMatrix(mat,[k,-3]),v=applyMatrix(mat,[k,3]),a=applyMatrix(mat,[-3,k]),b=applyMatrix(mat,[3,k]);
   line(p,xy(...u),xy(...v),'#8d9fff4d',1.2);line(p,xy(...a),xy(...b),'#8d9fff4d',1.2);
  }
  const quad:[Vec2,Vec2,Vec2,Vec2]=[[0,0],applyMatrix(mat,[1,0]),applyMatrix(mat,[1,1]),applyMatrix(mat,[0,1])];
  polygon(p,quad.map(q=>xy(...q)),'#ac8cff38','#cfacff');
  const x=applyMatrix(mat,[1,0]),y=applyMatrix(mat,[0,1]);
  arrow(p,xy(0,0),xy(...x),'#73dcef');arrow(p,xy(0,0),xy(...y),'#ffbd87');
  dot(p,xy(...x),5,'#6ce6f0');dot(p,xy(...y),5,'#ffbe82');
  label(p,`det = ${determinant(mat).toFixed(2)}`,23,h-101,'#dbc8ff');
 }
 if(scene==='ode'){
  const model=Math.round(pr.odeModel||0),k=pr.k,y0=pr.y0,dt=pr.dt,T=4,K=pr.capacity;
  const points=solveEulerModel(model,k,y0,T,dt,K);
  const peak=Math.max(y0,...points.map(q=>Math.max(q.y,q.exact)),model===1?K:0,1),up=peak*1.25;
  const to=(t:number,y:number):Vec2=>[w*.13+t*(w*.78/T),h*.86-y*(h*.68/up)];
  for(let i=0;i<=8;i++){const y=i*up/8;line(p,[w*.13,h*.86-y*h*.68/up],[w*.91,h*.86-y*h*.68/up],'#263a526c',.8)}
  for(let t=0;t<4;t+=.5)for(let j=0;j<7;j++){
   const y=j*up/7,slope=odeModelRate(model,k,y,K),px=to(t,y),vpx=(w*.78/T)*.15,vpy=-(h*.68/up)*slope*.15;
   const len=Math.max(1,Math.hypot(vpx,vpy));line(p,[px[0]-vpx/len*6,px[1]-vpy/len*6],[px[0]+vpx/len*6,px[1]+vpy/len*6],'#7894cb5e',1);
  }
  const exact:Vec2[]=[];for(let i=0;i<=220;i++){const t=i*T/220;exact.push(to(t,odeModelExact(model,k,y0,t,K)))}
  path(p,exact,'#80e9f7',3,10);
  const euler:Vec2[]=points.map(q=>to(q.t,q.y));path(p,euler,'#ffb971',2.4,5);
  for(const q of euler)dot(p,q,2.5,'#ffbe7a');
  label(p,'— solución exacta',23,h-116,'#86e9f7');label(p,'— Euler',23,h-96,'#ffd18e');
  label(p,'t',w-30,h*.86-10,'#c4d3e9');label(p,'y',w*.13+10,22,'#c4d3e9');
 }
 c.restore();
}
