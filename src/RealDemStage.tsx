import {useCallback,useEffect,useRef} from 'react';
import type {DemGrid} from './real-dem';
import {drawSampledDEM} from './real-dem-visual';
export default function RealDemStage({data,params,status,error,retry}:{data:DemGrid|null;params:Record<string,number>;status:'idle'|'loading'|'ready'|'error';error:string|null;retry:()=>void}){
 const canvas=useRef<HTMLCanvasElement|null>(null);
 const draw=useCallback(()=>{
  const el=canvas.current;if(!el||!data)return;
  const {width:w,height:h}=el.getBoundingClientRect();if(!w||!h)return;
  const dpr=Math.min(window.devicePixelRatio||1,w<700?1.25:1.6);
  const tw=Math.round(w*dpr),th=Math.round(h*dpr);if(el.width!==tw||el.height!==th){el.width=tw;el.height=th}
  const ctx=el.getContext('2d');if(!ctx)return;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  drawSampledDEM(ctx,w,h,data,params);
 },[data,params]);
 useEffect(()=>{
  const el=canvas.current;if(!el||!data)return;const observer=new ResizeObserver(draw);observer.observe(el);draw();return()=>observer.disconnect();
 },[data,draw]);
 return <div className='real-dem-stage' aria-label='Muestras de altura SRTM v3 sobre San Juan, no GeoTIFF original'>
  {data?<canvas ref={canvas} aria-label='Mapa de elevaciones reales muestreadas con curvas y perfil topográfico'/>:<div className='real-dem-message' role='status' aria-live='polite'>
   <span className='real-dem-eyebrow'>LIVE DATA · SRTM90M · SAN JUAN</span>
   <strong>{status==='error'?'Fuente temporalmente no disponible':'Consultando elevaciones reales…'}</strong>
   <p>{status==='error'?(error||'No se pudo conectar con el proveedor'):'81 puntos, WGS84 y alturas EGM96. Sin reemplazar datos faltantes por simulaciones.'}</p>
   {status==='error'&&<button type='button' onClick={retry}>Reintentar consulta</button>}
  </div>}
  {data&&<div className='real-dem-source'>DATOS CONSULTADOS · SRTM V3 / OpenTopoData · {data.requestedAt.slice(0,10)}</div>}
 </div>;
}
