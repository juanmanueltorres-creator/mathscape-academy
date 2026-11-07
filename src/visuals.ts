import type {SceneId} from './content';
import {applyMatrix,determinant,integrand,lorenzPoints,quadratic,superRadius,surface,gradientSurface,surfaceGradient,type Vec2,type Vec3} from './math';

export type ViewState={angle:number;time:number;pointer?:Vec2;focus?:'all'|'lissajous'|'lorenz'|'gielis'};
type Paint={c:CanvasRenderingContext2D;w:number;h:number;d:number;cx:number;cy:number;accent:string};
const ORBIT=lorenzPoints(1950);
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
 const c=p.c;c.beginPath();let started=false;
 for(let i=0;i<=480;i++){
  const x=xmin+(xmax-xmin)*i/480, y=fun(x);
  if(!Number.isFinite(y)||Math.abs(y)>1e4||(skip&&skip(x))){started=false;continue}
  const q=xy(x,y);if(!started){c.moveTo(...q);started=true}else c.lineTo(...q);
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
function surface3D(p:Paint,scene:SceneId,pr:Record<string,number>,angle:number){
 const b=scene==='double'?pr.bound:1.7,n=scene==='double'?Math.max(12,Math.min(pr.resolution*2,38)):28;
 const coeff=scene==='double'?pr.amplitude:pr.ga;
 const other=scene==='double'?pr.amplitude:pr.gb;
 const f=(x:number,y:number)=>scene==='double'?surface(x,y,coeff):gradientSurface(coeff,other,x,y)+.6;
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
  const g=surfaceGradient(coeff,other,x,y);
  dot(p,proj(x,y,z),6,'#ffe0a2');
  arrow(p,proj(x,y,0),proj(x+g[0]*.35,y+g[1]*.35,0),'#e5b1ff',2.5);
  line(p,proj(x,y,0),proj(x,y,z),'#fce0ac99',1.4);
  label(p,`∇f = (${g[0].toFixed(2)}, ${g[1].toFixed(2)})`,23,p.h-101,'#dce5ff');
 }
 label(p,'arrastra para rotar',p.w-175,p.h-100,'#7f90b4');
}
function atlas(p:Paint,pr:Record<string,number>,view:ViewState){
 const c=p.c;const t=view.time,base=Math.min(p.w,p.h)*.31;
 c.globalCompositeOperation='lighter';
 // Halo de líneas basadas en superfórmula, no una imagen precalculada.
 if(view.focus==='all'||view.focus==='gielis')for(let layer=0;layer<40;layer++){
  const pts:Vec2[]=[],phase=layer*.095+t*.13;
  const mod=layer%3;
  const m=5+mod,rad=base*(.68+layer/95);
  for(let i=0;i<=210;i++){
   const th=i/210*2*Math.PI,rr=Math.min(2.6,superRadius(th+phase,m,1.25,1.7,1.7));
   const X=p.cx+Math.cos(th+view.angle*.25)*rad*rr*.77;
   const Y=p.cy+Math.sin(th)*rad*rr*.41+Math.sin(th*3+phase)*22;
   pts.push([X,Y]);
  }
  path(p,pts,rgba(['#7edcff','#b19fff','#ffc58b'][mod],layer%7===0?.22:.085),layer%9===0?1.2:.55,layer%9===0?5:0);
 }
 const {freqA:a,freqB:b,phase}=pr;
 const orbitPts:Vec2[]=[];
 for(let i=0;i<=1500;i++){
  const th=i/1500*2*Math.PI;
  const x=Math.sin(a*th+phase)*base*.88;
  const y=Math.sin(b*th)*base*.7;
  orbitPts.push([p.cx+x,p.cy+y]);
 }
 if(view.focus==='all'||view.focus==='lissajous')path(p,orbitPts,'#85e7ffbd',2.2,16);
 // Atractor de Lorenz precomputado, proyección rotante.
 const az=view.angle*.42+t*.14;
 const lorPts:Vec2[]=ORBIT.map(([x,y,z]:Vec3)=>{
  const rx=x*Math.cos(az)-y*Math.sin(az);
  const ry=x*Math.sin(az)+y*Math.cos(az);
  return [p.cx+rx*base/27,p.cy+(ry*.5-(z-24)*.7)*base/30];
 });
 if(view.focus==='all'||view.focus==='lorenz')path(p,lorPts,'#c2a4ffaa',1,3);
 for(let i=0;i<190;i++){
  const th=i*2.39996+t*.03,dist=Math.sqrt(i/190)*base*1.38;
  dot(p,[p.cx+Math.cos(th)*dist,p.cy+Math.sin(th)*dist*.76],.55,rgba(['#74ecfb','#c49cff','#ffd2a4'][i%3],.32));
 }
 c.globalCompositeOperation='source-over';
 label(p,'LISSAJOUS   /   LORENZ   /   SUPERFÓRMULA',24,p.h-100,'#b3bfd8');
 label(p,`${a}:${b}  ·  δ=${phase.toFixed(2)}`,24,p.h-120,'#7fbacc');
}

export function drawScene(canvas:HTMLCanvasElement,scene:SceneId,pr:Record<string,number>,view:ViewState,accent:string){
 const rect=canvas.getBoundingClientRect();if(rect.width===0||rect.height===0)return;
 const d=Math.min(window.devicePixelRatio||1,2),w=rect.width,h=rect.height;
 if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(h*d)}
 const c=canvas.getContext('2d');if(!c)return;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);
 const p:Paint={c,w,h,d,cx:w*.52,cy:h*.51,accent};
 // Glow ambiental discreto. No afecta la relación matemática de los gráficos.
 const glow=c.createRadialGradient(p.cx,p.cy,10,p.cx,p.cy,Math.max(w,h)*.6);
 glow.addColorStop(0,rgba(accent,.10));glow.addColorStop(1,'#00000000');c.fillStyle=glow;c.fillRect(0,0,w,h);
 if(scene==='atlas'){atlas(p,pr,view);return}
 if(scene==='double'||scene==='gradient'){surface3D(p,scene,pr,view.angle);return}
 const span=scene==='ode'?5.0:scene==='integral'?4.9:4.15;
 const scale=Math.min(w/(span*2.25),h/(span*2.25));
 const xy=grid(p,scale,[scene==='integral'?w*.35:scene==='ode'?w*.14:p.cx,scene==='integral'?h*.79:scene==='ode'?h*.86:p.cy]);
 c.save();c.beginPath();c.rect(0,0,w,h);c.clip();
 if(scene==='functions'){
  const fn=(x:number)=>pr.fa*x*x+pr.fb*x+pr.fc;
  curve(p,xy,x=>Math.sin(x)*.5,'#d1a5ff66',-5,5,1.4);
  curve(p,xy,fn,'#82dcff',-5,5,3);
  dot(p,xy(0,pr.fc),5,'#ffcb85');
  label(p,'— curva modificable',23,h-96,'#85deff');label(p,'— seno (referencia)',23,h-116,'#c5a9fb');
 }
 if(scene==='limits'){
  const f=(x:number)=>Math.sin(x)/x;curve(p,xy,f,'#83def5',-4.5,4.5,2.7,x=>Math.abs(x)<.008);
  dot(p,xy(pr.lh,f(pr.lh)),5,'#ffc77d');dot(p,xy(-pr.lh,f(-pr.lh)),5,'#ffc77d');
  c.beginPath();c.arc(...xy(0,1),6,0,Math.PI*2);c.strokeStyle='#ffffff';c.lineWidth=2;c.stroke();
  line(p,xy(-3.7,1),xy(3.7,1),'#c8abf650',1);
  label(p,'hueco en (0,1)',xy(0,1)[0]+11,xy(0,1)[1]-13,'#e9f3ff');
 }
 if(scene==='derivative'){
  curve(p,xy,quadratic,'#6edbea',-4,4,3);
  const x0=pr.x0,hp=pr.h,ms=2*x0+hp,mt=2*x0;
  curve(p,xy,x=>x0*x0+mt*(x-x0),'#c5a0ff',-4,4,1.8);
  curve(p,xy,x=>x0*x0+ms*(x-x0),'#ffbd77',-4,4,2);
  dot(p,xy(x0,x0*x0),5,'#75e3ff');dot(p,xy(x0+hp,(x0+hp)**2),5,'#ffb973');
  label(p,'secante',23,h-116,'#ffc487');label(p,'tangente',23,h-96,'#cbb2ff');
 }
 if(scene==='integral'){
  const b=pr.upper,n=Math.round(pr.n),dx=b/n;
  for(let i=0;i<n;i++){
   const x=i*dx,y=integrand(x),a=xy(x,0),top=xy(x+dx,y);
   c.fillStyle='#fbb76b3c';c.strokeStyle='#ffc28b8a';c.lineWidth=.8;
   c.fillRect(a[0],top[1],dx*scale,y*scale);
   c.strokeRect(a[0],top[1],dx*scale,y*scale);
  }
  curve(p,xy,integrand,'#79ddf5',0,3.7,3);line(p,xy(b,0),xy(b,integrand(b)),'#e4afffb3',1.4);dot(p,xy(b,integrand(b)),4,'#ffd18e');
  label(p,`${n} rectángulos  ·  método izquierdo`,23,h-101,'#fbd1a2');
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
  // y'=k*y; comparación solución analítica y pasos explícitos de Euler.
  const k=pr.k,y0=pr.y0,dt=pr.dt,T=4;
  const final=Math.max(y0*Math.exp(k*T),y0);const up=Math.max(1,final*1.2);
  const to=(t:number,y:number):Vec2=>[w*.13+t*(w*.78/T),h*.86-y*(h*.68/up)];
  for(let i=0;i<=8;i++){
   const y=i*up/8;line(p,[w*.13,h*.86-y*h*.68/up],[w*.91,h*.86-y*h*.68/up],'#263a526c',.8);
  }
  for(let t=0;t<4;t+=.45)for(let j=0;j<7;j++){
   const y=j*up/7,slope=k*y,px=to(t,y),vpx=(w*.78/T)*.15,vpy=-(h*.68/up)*slope*.15;
   const len=Math.max(1,Math.hypot(vpx,vpy));line(p,[px[0]-vpx/len*7,px[1]-vpy/len*7],[px[0]+vpx/len*7,px[1]+vpy/len*7],'#7894cb5e',1);
  }
  const exact:Vec2[]=[];for(let i=0;i<=250;i++){const t=i*T/250;exact.push(to(t,y0*Math.exp(k*t)))}
  path(p,exact,'#80e9f7',3,12);
  const euler:Vec2[]=[];let t=0,y=y0;euler.push(to(0,y));
  while(t<T-1e-9){const step=Math.min(dt,T-t);y+=step*k*y;t+=step;euler.push(to(t,y));}
  path(p,euler,'#ffb971',2.4,6);for(const q of euler)dot(p,q,2.8,'#ffbe7a');
  label(p,'— exacta',23,h-116,'#86e9f7');label(p,'— Euler',23,h-96,'#ffd18e');
  label(p,'t',w-30,h*.86-10,'#c4d3e9');label(p,'y',w*.13+10,22,'#c4d3e9');
 }
 c.restore();
}
