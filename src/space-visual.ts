import {ORBIT_MISSIONS,orbitSummary,groundPoint,rad} from './satellites';
import {radarSummary,syntheticReflectivity,radialVelocity,syntheticSigma0,sigmaToDb} from './radar-lab';
const font=(c:CanvasRenderingContext2D,text:string,x:number,y:number,color='#a2bed4',size=11)=>{
 c.fillStyle=color;c.font='600 '+size+'px ui-monospace, monospace';c.fillText(text,x,y);
};
const line=(c:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number,color:string,w=1)=>{
 c.strokeStyle=color;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
};
const dot=(c:CanvasRenderingContext2D,x:number,y:number,r:number,color:string)=>{
 c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,2*Math.PI);c.fill();
};
const saturate=(v:number,lo:number,hi:number)=>Math.min(hi,Math.max(lo,v));
export function drawSatelliteLab(c:CanvasRenderingContext2D,w:number,h:number,p:Record<string,number>){
 const idx=Math.max(0,Math.min(2,Math.round(p.orbitModel||0))),t=p.orbitTime??360;
 const summary=orbitSummary(idx,t),m=ORBIT_MISSIONS[idx],compact=w<560;
 const gx=compact?w*.5:w*.275,gy=compact?h*.275:h*.43,r=Math.min(compact?w*.22:w*.19,compact?h*.19:h*.28);
 // Distinct illustrations: globe not to orbital-distance scale; ground track uses true lon/lat axes.
 c.save();
 const glow=c.createRadialGradient(gx-r*.4,gy-r*.5,5,gx,gy,r*1.45);
 glow.addColorStop(0,'#4d88965c');glow.addColorStop(.65,'#0f3d52');glow.addColorStop(1,'#041525');
 c.fillStyle=glow;c.beginPath();c.arc(gx,gy,r,0,2*Math.PI);c.fill();
 c.strokeStyle='#6eaec6';c.lineWidth=1.4;c.stroke();
 c.save();c.beginPath();c.arc(gx,gy,r,0,2*Math.PI);c.clip();
 for(let lat=-60;lat<=60;lat+=30){
  const y=gy-r*Math.sin(rad(lat)),rx=r*Math.cos(rad(lat));
  c.strokeStyle='#9ac4da55';c.lineWidth=.8;c.beginPath();c.ellipse(gx,y,rx,Math.max(4,rx*.22),0,0,Math.PI*2);c.stroke();
 }
 for(let lon=-60;lon<=60;lon+=30){
  c.strokeStyle='#8dbbcc55';c.beginPath();c.ellipse(gx,gy,Math.max(3,r*Math.cos(rad(lon))),r,0,-Math.PI/2,Math.PI/2);c.stroke();
 }
 c.restore();
 c.setLineDash([5,5]);c.strokeStyle='#e1c48a88';c.lineWidth=1.3;
 c.beginPath();c.ellipse(gx,gy,r*1.25,r*.34,m.inclinationDeg>0?-.48:0,0,Math.PI*2);c.stroke();c.setLineDash([]);
 const phase=t/summary.period*2*Math.PI;
 const satX=gx+Math.cos(phase)*r*1.25,satY=gy+Math.sin(phase)*r*.34;
 dot(c,satX,satY,5,'#ffe6ac');
 c.shadowColor='#ffdea4';c.shadowBlur=15;dot(c,satX,satY,2.5,'#fff4ca');c.shadowBlur=0;
 font(c,'ÓRBITA ILUSTRATIVA',Math.max(15,gx-r),Math.max(30,gy-r-27),'#b7dbe7',10);
 font(c,'NO A ESCALA',Math.max(15,gx-r),gy+r+31,'#849db9',9);
 const mx=compact?w*.10:w*.53,my=compact?h*.51:h*.19,mw=compact?w*.8:w*.40,mh=compact?h*.29:h*.46;
 c.fillStyle='#09192b';c.fillRect(mx,my,mw,mh);c.strokeStyle='#46627a';c.lineWidth=1;c.strokeRect(mx,my,mw,mh);
 for(let lat=-60;lat<=60;lat+=30)line(c,mx,my+(90-lat)/180*mh,mx+mw,my+(90-lat)/180*mh,'#43617a8c',.7);
 for(let lon=-150;lon<=150;lon+=30)line(c,mx+(lon+180)/360*mw,my,mx+(lon+180)/360*mw,my+mh,'#43617a8c',.7);
 c.save();c.beginPath();c.rect(mx,my,mw,mh);c.clip();
 let lastX=-1;
 const steps=Math.max(1,Math.min(400,Math.ceil(t/5)));
 c.beginPath();
 for(let i=0;i<=steps;i++){
  const point=groundPoint(idx,t*i/steps);
  const x=mx+(point.lon+180)/360*mw,y=my+(90-point.lat)/180*mh;
  if(lastX<0||Math.abs(x-lastX)>mw*.5)c.moveTo(x,y);else c.lineTo(x,y);
  lastX=x;
 }
 c.strokeStyle='#84e5dc';c.lineWidth=2.25;c.shadowColor='#7af6e9';c.shadowBlur=6;c.stroke();c.shadowBlur=0;
 const loc=summary.point,xx=mx+(loc.lon+180)/360*mw,yy=my+(90-loc.lat)/180*mh;
 dot(c,xx,yy,5,'#ffd6a1');
 c.restore();
 font(c,'TRAZA SOBRE LA TIERRA · NO ES TLE',mx,Math.max(19,my-15),'#c4ebeb',10);
 font(c,'λ '+summary.point.lon.toFixed(1)+'°  φ '+summary.point.lat.toFixed(1)+'°',mx,Math.min(h-29,my+mh+25),'#b2c8d8');
 font(c,'ÓRBITA KEPLERIANA SIMPLIFICADA · SIN POSICIÓN EN VIVO',Math.max(14,w*.09),h-22,'#7c9aaf',9);
 c.restore();
}
export function drawRadarLab(c:CanvasRenderingContext2D,w:number,h:number,p:Record<string,number>){
 const mode=Math.max(0,Math.min(2,Math.round(p.radarType||0))),summary=radarSummary(p);
 const cx=w*.5,cy=h*.47,r=Math.min(w*.38,h*.33);
 if(mode<=1){
  const cell=6,wind=p.radarWind??25,dir=p.radarDirection??100,peak=p.radarDbz??52;
  for(let y=-r;y<r;y+=cell)for(let x=-r;x<r;x+=cell){
   const nx=x/r,ny=-y/r,dist=Math.hypot(nx,ny);
   if(dist>1)continue;
   if(mode===0){
    const z=syntheticReflectivity(nx,ny,peak);
    const val=saturate((z+10)/75,0,1);
    c.fillStyle=val<.22?'#0c2834':val<.4?'#177c89':val<.6?'#46a46f':val<.79?'#d5ae56':'#e86d6a';
   }else{
    const az=Math.atan2(nx,ny)*180/Math.PI; // bearing clockwise from North
    const vr=radialVelocity(wind,dir,az),a=saturate(Math.abs(vr)/40,0,1);
    c.fillStyle=vr>=0?'rgb('+(30+190*a).toFixed(0)+','+(49+65*a).toFixed(0)+','+(80+35*a).toFixed(0)+')'
      :'rgb('+(23+38*a).toFixed(0)+','+(55+155*a).toFixed(0)+','+(81+108*a).toFixed(0)+')';
   }
   c.fillRect(cx+x,cy+y,cell+.5,cell+.5);
  }
  c.strokeStyle='#8ea8b877';for(let k=1;k<=4;k++){
   c.lineWidth=.8;c.beginPath();c.arc(cx,cy,r*k/4,0,2*Math.PI);c.stroke();
  }
  for(let ang=0;ang<360;ang+=45){const a=rad(ang);line(c,cx,cy,cx+r*Math.cos(a),cy+r*Math.sin(a),'#91b3c044',.75)}
  dot(c,cx,cy,4,'#ffe0ac');
  const bearing=rad(p.radarBearing??45);
  line(c,cx,cy,cx+Math.sin(bearing)*r,cy-Math.cos(bearing)*r,'#ffdda1',2.3);
  font(c,mode===0?'REFLECTIVIDAD · ECOS ATMOSFÉRICOS':'DOPPLER · MOVIMIENTO RADIAL',Math.max(12,cx-r),Math.max(25,cy-r-22),'#dceff6');
  font(c,mode===0?'CAMPO DE dBZ INVENTADO':'VIENTO UNIFORME INVENTADO',Math.max(15,cx-r),Math.min(h-46,cy+r+27),'#92b1c8',10);
 }else{
  // Different scene on purpose: SAR looks at surface backscatter, not atmospheric precipitation.
  const x0=w*.17,y0=h*.17,ww=w*.66,hh=h*.61,n=70,cellX=ww/n,cellY=hh/n;
  const incidence=p.radarIncidence??35,rough=p.radarRoughness??.5;
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){
   const x=i/n,y=j/n;
   const mix=.42+.32*Math.sin(x*17+y*8)*Math.cos(y*24-x*11)+.17*Math.sin(x*55-y*30);
   const localRough=saturate(rough*mix+.18,0,1);
   const db=sigmaToDb(syntheticSigma0(localRough,incidence));
   const v=saturate((db+20)/19,0,1),tone=Math.round(26+v*199);
   c.fillStyle='rgb('+tone+','+Math.min(255,tone+14)+','+Math.min(255,tone+21)+')';
   c.fillRect(x0+i*cellX,y0+j*cellY,cellX+.5,cellY+.5);
  }
  c.strokeStyle='#86b4c1';c.lineWidth=1;c.strokeRect(x0,y0,ww,hh);
  font(c,'ESCENA SAR SINTÉTICA · RETORNO DE SUPERFICIE',x0,Math.max(30,y0-18),'#dceff6');
  font(c,'GRISES ≠ LLUVIA   |   NO IMAGEN SAOCOM',x0,Math.min(h-31,y0+hh+29),'#a7c6d9',10);
  const sx=x0+ww*.5,sy=y0-35;dot(c,sx,sy,5,'#ffcf8e');
  line(c,sx,sy,sx+hh*.16,sy+hh*.29,'#ffdda8',1.7);
 }
 const val=Number.isFinite(summary.value)?summary.value.toFixed(mode===1?1:2):'—';
 font(c,summary.kind.name.toUpperCase(),Math.max(14,w*.13),h-19,'#c4e4ed',9);
 font(c,val+' '+summary.unit,Math.max(14,w*.13),Math.min(h-43,mode===2?h*.85:cy+r+49),'#ffcf9a',12);
}
