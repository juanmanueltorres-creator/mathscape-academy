import {useState} from 'react';
import {
 technicalStages,commercialStages,industrialCases,stageDetail,systemState,
 type IndustrialCaseId,type Connectivity,type Power
} from './industrial-pipeline';
import './industrial-guide.css';

type View='technical'|'commercial';
const ids=Object.keys(industrialCases) as IndustrialCaseId[];

export default function IndustrialSystemsGuide({onComplete}:{onComplete:()=>void}){
 const [selected,setSelected]=useState<IndustrialCaseId>('core');
 const [view,setView]=useState<View>('technical');
 const [step,setStep]=useState(0);
 const [connectivity,setConnectivity]=useState<Connectivity>('online');
 const [power,setPower]=useState<Power>('available');
 const [explored,setExplored]=useState<IndustrialCaseId[]>([]);
 const example=industrialCases[selected];
 const state=systemState(connectivity,power);
 const tech=technicalStages[step]??technicalStages[0];
 const commercial=commercialStages[Math.min(step,commercialStages.length-1)];
 const changeView=(next:View)=>{setView(next);setStep(0)};
 const mark=()=>{
  if(explored.includes(selected))return;
  const next=[...explored,selected];setExplored(next);
  if(next.length===ids.length)onComplete();
 };
 return <section className="industry-guide" aria-label="Guía interactiva: del sensor al servicio industrial">
  <div className="industry-hero">
   <div><span className="industry-kicker">G4 / SISTEMAS INDUSTRIALES</span>
    <h2>Del campo a la decisión.</h2>
    <p>Un sensor mide. La electrónica adquiere. Las redes conectan. El software interpreta datos. Una empresa convierte todo eso en un servicio.</p>
   </div>
   <span className="industry-scope">CASOS DIDÁCTICOS · NO TELEMETRÍA REAL</span>
  </div>
  <div className="industry-case-picker" role="group" aria-label="Elegir industria">
   {ids.map(id=><button type="button" key={id} aria-pressed={selected===id} className={selected===id?'active':''}
    onClick={()=>{setSelected(id);setStep(0)}}>
    <small>{explored.includes(id)?'✓ CASO EXPLORADO':'EXPLORAR CASO'}</small>
    <strong>{industrialCases[id].label}</strong></button>)}
  </div>
  <div className="industry-question"><span>01 / PROBLEMA REAL</span><p>{example.problem}</p></div>
  <nav className="industry-view-toggle" aria-label="Elegir recorrido">
   <button type="button" className={view==='technical'?'active':''} aria-pressed={view==='technical'} onClick={()=>changeView('technical')}>Recorrido técnico</button>
   <button type="button" className={view==='commercial'?'active':''} aria-pressed={view==='commercial'} onClick={()=>changeView('commercial')}>Del problema al contrato</button>
  </nav>
  <div className="industry-body">
   <div className="industry-primary">
    <div className="industry-stages" role="group" aria-label={view==='technical'?'Etapas técnicas':'Etapas comerciales'}>
     {view==='technical'?technicalStages.map((s,i)=><button type="button" key={s.id} className={i===step?'active':''} aria-pressed={i===step} onClick={()=>setStep(i)}><span>{s.title}</span><small>{i===step?'●':'→'}</small></button>):
     commercialStages.map((s,i)=><button type="button" key={s.id} className={i===step?'active':''} aria-pressed={i===step} onClick={()=>setStep(i)}><span>{String(i+1).padStart(2,'0')} · {s.title}</span><small>{i===step?'●':'→'}</small></button>)}
    </div>
    {view==='technical'?<article className="industry-reading" aria-live="polite">
     <span>ETAPA {String(step+1).padStart(2,'0')} / 07 · SISTEMA</span>
     <h3>{tech.question}</h3><p>{stageDetail(selected,tech.id)}</p>
     <div className="industry-insight"><strong>Qué importa</strong><p>{tech.note}</p></div>
    </article>:<article className="industry-reading" aria-live="polite">
     <span>ETAPA {String(step+1).padStart(2,'0')} / 06 · NEGOCIO B2B</span>
     <h3>{commercial.title}</h3><p>{commercial.detail}</p>
     <div className="industry-insight"><strong>¿Para quién?</strong><p>{example.buyer}</p>
      <strong>Valor que habría que demostrar</strong><p>{example.value}</p></div>
    </article>}
   </div>
   <aside className="industry-lab" aria-label="Simulador conceptual de disponibilidad">
    <span className="industry-kicker">EXPERIMENTO · RED Y ENERGÍA</span>
    <h3>¿Qué pasa si falla una capa?</h3>
    <p>Cambiá las condiciones del ejemplo y observá la diferencia entre medir, guardar y transmitir.</p>
    <fieldset><legend>Alimentación</legend>
     <label><input type="radio" name="industrial-power" checked={power==='available'} onChange={()=>setPower('available')}/> Disponible</label>
     <label><input type="radio" name="industrial-power" checked={power==='failed'} onChange={()=>setPower('failed')}/> Interrumpida</label>
    </fieldset>
    <fieldset><legend>Conectividad</legend>
     <label><input type="radio" name="industrial-link" checked={connectivity==='online'} onChange={()=>setConnectivity('online')}/> Con red</label>
     <label><input type="radio" name="industrial-link" checked={connectivity==='offline'} onChange={()=>setConnectivity('offline')}/> Sin cobertura</label>
    </fieldset>
    <div className={'industry-state state-'+state.id} role="status" aria-live="polite">
     <strong>{state.title}</strong><p>{state.detail}</p>
     <div className="industry-state-flags">
      <span>Registro local: {state.local?'posible':'no disponible'}</span>
      <span>Envío actual: {state.remote?'posible':'no disponible'}</span>
     </div>
    </div>
    <small className="industry-footnote">Modelo lógico ilustrativo. En un sistema real, el respaldo y almacenamiento dependen del diseño; no hay mediciones, alertas ni control remoto.</small>
   </aside>
  </div>
  <footer className="industry-outro">
   <div><span className="industry-kicker">CIERRE / LÍMITE</span><p>{example.caution}</p>
    <p>Medición ≠ dato validado ≠ conclusión ≠ acción autorizada. Monitorear un dispositivo no equivale a controlarlo.</p></div>
   <div className="industry-finish"><button type="button" disabled={explored.includes(selected)} onClick={mark}>
    {explored.includes(selected)?'Caso explorado ✓':'Marcar caso explorado ↗'}
    </button><small>{explored.length} de {ids.length} casos explorados. Probá también el recorrido comercial.</small></div>
  </footer>
 </section>;
}
