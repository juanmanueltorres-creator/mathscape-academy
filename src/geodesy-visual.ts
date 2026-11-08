import {geodesyReport} from './geodesy';
const line=(c:CanvasRenderingContext2D,x:number,y:number,X:number,Y:number,color:string,width=1)=>{
 c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.strokeStyle=color;c.lineWidth=width;c.stroke();
};
const label=(c:CanvasRenderingContext2D,text:string,x:number,y:number,color='#9cb8cf',size=11)=>{
 c.fillStyle=color;c.font='600 '+size+'px ui-monospace, monospace';c.fillText(text,x,y);
};
export function drawGeodesy(c:CanvasRenderingContext2D,w:number,h:number,p:Record<string,number>){
 const info=geodesyReport(p),compact=w<570;
 const top=compact?h*.19:h*.24;
 const left=compact?w*.075:w*.06;
 const width=compact?w*.85:w*.40,height=compact?h*.30:h*.51;
 const rightX=compact?left:w*.54,rightY=compact?h*.61:top;
 const region={lonMin:-76,lonMax:-52,latMin:-55,latMax:-20};
 const screen=(lon:number,lat:number):[number,number]=>[
  left+(lon-region.lonMin)/(region.lonMax-region.lonMin)*width,
  top+(region.latMax-lat)/(region.latMax-region.latMin)*height
 ];
 c.fillStyle='#0c1d2c';c.fillRect(left,top,width,height);
 c.strokeStyle='#54758c';c.lineWidth=1;c.strokeRect(left,top,width,height);
 // Geographic meridians and parallels remain angular degrees, not metres.
 for(let lon=-75;lon<=-54;lon+=3){const [x]=screen(lon,-40);line(c,x,top,x,top+height,'rgba(133,186,212,.24)');if(lon%6===0)label(c,lon+'°',x+3,top+height+15,'#6a95aa',9)}
 for(let lat=-50;lat<=-20;lat+=5){const [,y]=screen(-60,lat);line(c,left,y,left+width,y,'rgba(133,186,212,.24)');if(lat%10===0)label(c,lat+'°',left+3,y-4,'#6a95aa',9)}
 const [px,py]=screen(info.lon,info.lat);
 c.beginPath();c.arc(px,py,5,0,Math.PI*2);c.fillStyle='#ffd49d';c.fill();
 c.beginPath();c.arc(px,py,13,0,2*Math.PI);c.strokeStyle='#ffc27a66';c.lineWidth=1.5;c.stroke();
 label(c,'φ, λ  ·  GRADOS',left,Math.max(19,top-19),'#bcdeed',11);
 label(c,info.place.name.toUpperCase(),left,Math.min(h-22,top+height+32),'#e4eff6',10);
 // Right panel: a *local* projective metric grid centered at the selected coordinates.
 // 1 unit = 1 km and equal screen scaling on both axes; no invented map contours.
 const side=compact?Math.min(width,h*.28):Math.min(width,height),boxX=rightX+(width-side)/2,boxY=rightY+(height-side)/2;
 const worldHalf=100000,metersPerPixel=2*worldHalf/side;
 c.fillStyle='#091b2c';c.fillRect(boxX,boxY,side,side);
 c.strokeStyle='#577f96';c.strokeRect(boxX,boxY,side,side);
 for(let km=-100;km<=100;km+=25){
  const d=km*1000/metersPerPixel,xx=boxX+side*.5+d,yy=boxY+side*.5+d;
  line(c,xx,boxY,xx,boxY+side,km===0?'#9cdbdb91':'#58768c66',km===0?1.5:.8);
  line(c,boxX,yy,boxX+side,yy,km===0?'#9cdbdb91':'#58768c66',km===0?1.5:.8);
 }
 const datum=info.coord;
 const [C_X,C_Y]=[boxX+side*.5,boxY+side*.5];
 // A 0.1° change east and north: show why degree-distance is latitude dependent.
 const eastM=info.eastDistance,northM=info.northDistance;
 line(c,C_X,C_Y,C_X+eastM/metersPerPixel,C_Y,'#88e6ec',3);
 line(c,C_X,C_Y,C_X,C_Y-northM/metersPerPixel,'#ffc486',3);
 c.beginPath();c.arc(C_X,C_Y,5,0,Math.PI*2);c.fillStyle='#f8f4e7';c.fill();
 label(c,'Δλ 0,1°',C_X+eastM/metersPerPixel+5,C_Y-9,'#85dfe8',10);
 label(c,'Δφ 0,1°',C_X+9,C_Y-northM/metersPerPixel-6,'#ffd4a1',10);
 label(c,'PLANO PROYECTADO  ·  METROS',rightX,Math.max(25,rightY-19),'#bcdeed',11);
 label(c,'E: '+Math.round(datum.easting).toLocaleString('es-AR')+' m',rightX,Math.min(h-25,rightY+height+26),'#afe7e2',10);
 label(c,'N: '+Math.round(datum.northing).toLocaleString('es-AR')+' m',rightX,Math.min(h-8,rightY+height+42),'#9fc2d5',10);
 const foot='Faja/zona '+datum.zone+'  ·  λ₀ '+datum.centralMeridian+'°  ·  EPSG:'+datum.epsg;
 label(c,foot,Math.max(12,w*.05),h-15,'#819bb7',9);
}
