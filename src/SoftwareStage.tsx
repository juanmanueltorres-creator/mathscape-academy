import type {CSSProperties} from 'react';
import type {ProductId} from './software';
import {modelDecision,PRODUCTS} from './software';
type Props={
 view:'product'|'software';product:number;mode:number;step:number;
 onProduct:(i:number)=>void;onMode:(i:number)=>void;onStep:(i:number)=>void;onExplore:()=>void;
};
const modeNames=['Funciona','Dato inválido','Reintento'] as const;
const toCode=(id:ProductId,mode:number)=>{
 if(id==='maps')return mode===1
  ?['GET /rutas?origen=desconocido','→ 422 · coordenadas inválidas']
  :['GET /rutas?origen=A&destino=B','→ 200 · ruta + ETA 18 min'];
 if(id==='social')return mode===1
  ?['POST /publicaciones · archivo=excesivo','→ 413 · tamaño no admitido']
  :mode===2?['GET /publicaciones/op-123','→ 200 · estado anterior']:['POST /publicaciones · imagen válida','→ 201 · publicación creada'];
 return mode===1?['POST /transferencias · importe > saldo','→ 422 · sin movimiento']
  :mode===2?['POST /transferencias · misma clave','→ 200 · op-123 · un solo débito']
  :['POST /transferencias · clave=op-123','→ 202 · recibida, todavía pendiente'];
};
export default function SoftwareStage({view,product,mode,step,onProduct,onMode,onStep,onExplore}:Props){
 const {p,outcome}=modelDecision(product,mode);
 const selected=p.nodes[Math.max(0,Math.min(5,Math.round(step)))];
 const code=toCode(p.id,mode);
 return <div className={'software-stage software-'+view} style={{'--case-accent':p.accent} as CSSProperties} aria-label='Laboratorio interactivo de producto y arquitectura'>
  <div className='sw-tabs' role='group' aria-label='Elegir caso de producto'>{PRODUCTS.map((candidate,i)=>
   <button key={candidate.id} type='button' className={i===product?'selected':''}
     aria-pressed={i===product} onClick={()=>onProduct(i)}>
    <span className='sw-tab-index'>0{i+1}</span>{candidate.name}</button>
  )}</div>
  {view==='product'?<div className='sw-editorial'>
   <div className='sw-eyebrow'>{p.eyebrow} / UNA NECESIDAD</div>
   <h2>{p.promise}</h2>
   <div className='sw-value-row'><div><small>NECESIDAD</small><strong>{p.need}</strong></div><div><small>¿QUÉ IMPORTA?</small><strong>{p.metric}</strong></div></div>
   <p className='sw-editorial-question'>Una misma pregunta: ¿qué tiene que pasar para que funcione?</p>
   <div className='sw-journey' aria-label='Recorrido de producto'>
    {p.nodes.map((node,i)=><button type='button' className={'sw-journey-item '+(i===step?'is-active':'')} key={node.token}
     aria-pressed={i===step} onClick={()=>onStep(i)}>
     <span>{node.token} / {node.layer}</span><b>{node.label}</b></button>)}
   </div>
   <div className='sw-moment'><span>{selected.label}</span><p>{selected.impact}</p></div>
   <button className='sw-explore' onClick={onExplore}>Ver qué ocurre detrás <span>↗</span></button>
  </div>:<div className='sw-system'>
   <div className='sw-system-title'><div><small>RECORRIDO DE UNA SOLICITUD</small><h2>{p.action}</h2></div><span className={'sw-http '+outcome.state}>{outcome.status}</span></div>
   <div className='sw-journey sw-journey-system' aria-label='Capas del sistema'>
    {p.nodes.map((node,i)=><button type='button' className={'sw-journey-item '+(i===step?'is-active':'')} key={node.token}
     aria-pressed={i===step} onClick={()=>onStep(i)}>
     <span>{node.token} / {node.layer}</span><b>{node.label}</b></button>)}
   </div>
   <div className='sw-detail' aria-live='polite'>
    <span className='sw-detail-category'>{selected.layer} · {selected.label}</span>
    <h3>{selected.action}</h3><p>{selected.detail}</p>
   </div>
   <div className='sw-console'><code><span>{code[0]}</span><span>{code[1]}</span></code><small>RECORRIDO ILUSTRATIVO</small></div>
   <div className='sw-modes' role='group' aria-label='Resultado de la solicitud'>
    {modeNames.map((name,i)=><button type='button' key={name} className={mode===i?'selected':''}
    aria-pressed={mode===i} onClick={()=>onMode(i)}>{name}</button>)}
   </div>
  </div>}
 </div>;
}
