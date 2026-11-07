import {applyMatrix, determinant, derivativeQuadratic, exactIntegral, integrand, leftRiemann, quadratic, secantQuadratic, type Mat2, type Vec2} from './math';
export type Chapter = 'base' | 'derivative' | 'integral' | 'matrix';
export type Params = {m:number;b:number;x0:number;h:number;n:number;upper:number;a:number;mb:number;c:number;d:number};
type LineOpts={color?:string;width?:number;dash?:number[];glow?:number};
export function drawScene(canvas: HTMLCanvasElement, chapter: Chapter, p: Params): void {
 const ctx=canvas.getContext('2d'); if(!ctx)return;
 const box=canvas.getBoundingClientRect();const w=Math.max(box.width,1),h=Math.max(box.height,1),pr=Math.min(window.devicePixelRatio||1,2);
 const cw=Math.round(w*pr),ch=Math.round(h*pr);if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch;}
 ctx.setTransform(pr,0,0,pr,0,0);ctx.clearRect(0,0,w,h);
 const extent=chapter==='integral'?4.5:4.1;const scale=Math.min(w/(2*extent),h/(2*extent))*.93;
 const originX=w*.5,originY=h*.52;
 const xy=(x:number,y:number):Vec2=>[originX+x*scale,originY-y*scale];
 const segment=(a:Vec2,b:Vec2,opt:LineOpts={})=>{ctx.beginPath();ctx.moveTo(...xy(...a));ctx.lineTo(...xy(...b));ctx.lineWidth=opt.width??1;ctx.strokeStyle=opt.color??'#28405b';ctx.setLineDash(opt.dash??[]);ctx.shadowColor=opt.color??'transparent';ctx.shadowBlur=opt.glow??0;ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;};
 const point=(x:number,y:number,color:string,r=5)=>{const [px,py]=xy(x,y);ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.fillStyle=color;ctx.shadowBlur=18;ctx.shadowColor=color;ctx.fill();ctx.shadowBlur=0;};
 const curve=(fn:(x:number)=>number,color:string,width=2.6,min=-extent,max=extent)=>{ctx.save();ctx.beginPath();let started=false;for(let x=min;x<=max;x+=(max-min)/220){const y=fn(x);if(!Number.isFinite(y)||Math.abs(y)>15){started=false;continue}let [px,py]=xy(x,y);if(!started){ctx.moveTo(px,py);started=true}else ctx.lineTo(px,py)}ctx.strokeStyle=color;ctx.lineWidth=width;ctx.shadowColor=color;ctx.shadowBlur=12;ctx.stroke();ctx.restore();};
 const polygon=(points:Vec2[],fill:string,stroke?:string)=>{ctx.beginPath();points.forEach((v,i)=>i?ctx.lineTo(...xy(...v)):ctx.moveTo(...xy(...v)));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}};
 // Grilla científica siempre visible para que la forma conserve significado cuantitativo.
 for(let v=-4;v<=4;v++){segment([v,-extent],[v,extent],{color:v===0?'#637593':'#26344e',width:v===0?1.35:.7});segment([-extent,v],[extent,v],{color:v===0?'#637593':'#26344e',width:v===0?1.35:.7});}
 ctx.font='11px system-ui';ctx.fillStyle='#7d91b0';for(let v=-4;v<=4;v+=2){if(v){let [px,py]=xy(v,0);ctx.fillText(String(v),px-4,py+14);[px,py]=xy(0,v);ctx.fillText(String(v),px+8,py+4)}}
 ctx.fillStyle='#a5b5da';ctx.fillText('x',w-18,originY-10);ctx.fillText('y',originX+10,18);
 if(chapter==='base'){curve(x=>p.m*x+p.b,'#70e1f8');point(0,p.b,'#ffc184');let q=2;segment([0,p.b],[q,p.m*q+p.b],{color:'#ffc184',dash:[5,4],width:1.4});}
 if(chapter==='derivative'){
   curve(quadratic,'#80dfff',2.8);
   const m=secantQuadratic(p.x0,p.h),mt=derivativeQuadratic(p.x0);
   segment([p.x0-3,quadratic(p.x0)-3*m],[p.x0+3,quadratic(p.x0)+3*m],{color:'#ffbe77',width:1.6,dash:[6,5]});
   segment([p.x0-3,quadratic(p.x0)-3*mt],[p.x0+3,quadratic(p.x0)+3*mt],{color:'#b89aff',width:2});
   segment([p.x0,quadratic(p.x0)],[p.x0+p.h,quadratic(p.x0)],{color:'#a2afc5',dash:[3,3]});
   segment([p.x0+p.h,quadratic(p.x0)],[p.x0+p.h,quadratic(p.x0+p.h)],{color:'#a2afc5',dash:[3,3]});
   point(p.x0,quadratic(p.x0),'#b89aff');point(p.x0+p.h,quadratic(p.x0+p.h),'#ffbe77',4);
 }
 if(chapter==='integral'){
  const end=p.upper,dx=end/p.n;for(let i=0;i<p.n;i++){const x=i*dx,y=integrand(x);polygon([[x,0],[x+dx,0],[x+dx,y],[x,y]],'rgba(124,219,239,0.15)','#7ee3f0');}
  curve(integrand,'#ffc184',2.6,-1,end+.55);
  point(0,integrand(0),'#ffc184',3);point(end,integrand(end),'#ffc184',3);
 }
 if(chapter==='matrix'){
  const mat:Mat2=[p.a,p.mb,p.c,p.d];
  // Imagen de la grilla y del cuadrado unidad bajo la transformación lineal.
  for(let v=-3;v<=3;v++){segment(applyMatrix(mat,[v,-3]),applyMatrix(mat,[v,3]),{color:'#637cd153',width:1});segment(applyMatrix(mat,[-3,v]),applyMatrix(mat,[3,v]),{color:'#637cd153',width:1})}
  polygon([[0,0],applyMatrix(mat,[1,0]),applyMatrix(mat,[1,1]),applyMatrix(mat,[0,1])],'rgba(181,142,255,.19)','#c4a0ff');
  const ex=applyMatrix(mat,[1,0]),ey=applyMatrix(mat,[0,1]);segment([0,0],ex,{color:'#7ae1f5',width:3,glow:10});segment([0,0],ey,{color:'#ffbf84',width:3,glow:10});point(...ex,'#7ae1f5');point(...ey,'#ffbf84');
  ctx.fillStyle='#d5c3ff';ctx.fillText('det = '+determinant(mat).toFixed(2),16,30);
 }
}
export function observations(chapter:Chapter,p:Params):{formula:string,metrics:{label:string,value:string}[],message:string,pass:boolean,hint:string}{
 const fmt=(n:number)=>Number(n.toFixed(3)).toLocaleString('es-AR');
 if(chapter==='base')return {formula:'f(x) = '+fmt(p.m)+'x '+(p.b<0?'−':'+')+' '+fmt(Math.abs(p.b)),metrics:[{label:'Pendiente',value:fmt(p.m)},{label:'Ordenada',value:fmt(p.b)}],message:'La pendiente controla cuánto sube la recta al avanzar una unidad en x. La ordenada fija el cruce con el eje y.',pass:Math.abs(p.m-2)<.05&&Math.abs(p.b+1)<.05,hint:'Buscá pendiente 2 y ordenada −1.'};
 if(chapter==='derivative'){const ms=secantQuadratic(p.x0,p.h),mt=derivativeQuadratic(p.x0);return{formula:'f(x) = x²  ·  f′(x) = 2x',metrics:[{label:'Pendiente secante',value:fmt(ms)},{label:'Pendiente tangente',value:fmt(mt)},{label:'Diferencia',value:fmt(Math.abs(ms-mt))}],message:'Al reducir h, la pendiente secante se aproxima a la tangente. La derivada es el límite de esa razón de cambio.',pass:Math.abs(ms-mt)<.11,hint:'Acercá h a 0,05. Observá cómo coinciden las dos pendientes.'};}
 if(chapter==='integral'){const approx=leftRiemann(0,p.upper,p.n),exact=exactIntegral(0,p.upper),err=Math.abs(approx-exact);return {formula:'∫₀'+fmt(p.upper)+' (x²/4 + 1/2) dx',metrics:[{label:'Suma izquierda',value:fmt(approx)},{label:'Integral exacta',value:fmt(exact)},{label:'Error absoluto',value:fmt(err)}],message:'Cada rectángulo suma una pequeña contribución. Aumentar n reduce el ancho y aproxima la acumulación para esta función creciente.',pass:err<.06,hint:'Aumentá el número de rectángulos hasta que el error sea menor a 0,06.'};}
 const det=determinant([p.a,p.mb,p.c,p.d]);return{formula:'[ '+fmt(p.a)+'   '+fmt(p.mb)+' ]   [ '+fmt(p.c)+'   '+fmt(p.d)+' ]',metrics:[{label:'Determinante',value:fmt(det)},{label:'Factor de área',value:fmt(Math.abs(det))}],message:'Una matriz transforma todos los puntos del plano. El valor absoluto del determinante indica cuánto escala el área; si vale 0, el plano se aplasta en una línea o un punto.',pass:Math.abs(det)<.01,hint:'Probá hacer dos filas iguales: por ejemplo a = 1, b = 1, c = 1, d = 1.'};
}
