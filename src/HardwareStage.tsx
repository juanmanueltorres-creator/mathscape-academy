import {useState,type CSSProperties} from 'react';
import {PARTS,LAYERS,JOURNEYS,HARDWARE_QUIZ,getPart,journeyState,quizCorrect,type HardwarePartId,type JourneyId,type FaultId} from './hardware';

type View='machine'|'boot'|'web';
type Props={onComplete:()=>void};

function Board({selected}: {selected:HardwarePartId}){
 const active=(id:HardwarePartId)=>selected===id;
 const stroke=(id:HardwarePartId)=>active(id)?getPart(id).accent:'#48647e';
 const fill=(id:HardwarePartId)=>active(id)?'#214d64':'#142d43';
 return <svg className='hw-board-svg' viewBox='0 0 600 390' role='img' aria-label={'Placa madre ilustrativa, componente seleccionado: '+getPart(selected).label}>
  <defs><linearGradient id='board-bg' x1='0' x2='1' y1='0' y2='1'><stop stopColor='#142d44'/><stop offset='1' stopColor='#091a2d'/></linearGradient>
   <pattern id='board-trace' width='28' height='28' patternUnits='userSpaceOnUse'><path d='M28 0H0V28' fill='none' stroke='#214b5a' strokeWidth='.6' opacity='.55'/></pattern>
  </defs>
  <rect x='62' y='28' width='478' height='335' rx='18' fill='url(#board-bg)' stroke={stroke('motherboard')} strokeWidth={active('motherboard')?4:2}/>
  <rect x='70' y='36' width='462' height='319' rx='13' fill='url(#board-trace)'/>
  {Array.from({length:12},(_,i)=><g key={i} stroke='#2d8095' strokeWidth='2' opacity='.32' fill='none'><path d={'M'+(92+i*32)+' 63V'+(94+(i%4)*18)+'H'+(168+(i%3)*19)}/><path d={'M'+(100+i*30)+' 335V'+(281-(i%3)*13)+'H'+(230+i%4*21)}/></g>)}
  <path d='M215 188H286V133H363M215 203H280V260H360M215 218H286V309H470' stroke='#64d3de' strokeWidth='3' strokeLinecap='round' fill='none' opacity='.65'/>
  <rect x='137' y='127' width='119' height='119' rx='12' fill={fill('cpu')} stroke={stroke('cpu')} strokeWidth={active('cpu')?4:2}/>
  {Array.from({length:8},(_,i)=><g key={i} stroke='#79c5dd' opacity='.7'><path d={'M'+(146+i*14)+' 119v8M'+(146+i*14)+' 246v8'}/><path d={'M129 '+(135+i*14)+'h8M256 '+(135+i*14)+'h8'}/></g>)}
  <rect x='166' y='157' width='62' height='61' rx='6' fill='#0c1d30' stroke='#6493bb'/>
  <text x='197' y='190' textAnchor='middle' fill='#e5faff' fontSize='18' fontWeight='750'>CPU</text>
  {Array.from({length:4},(_,i)=><g key={i}>
   <rect x={325+i*26} y='90' width='18' height='157' rx='4' fill={fill('ram')} stroke={stroke('ram')} strokeWidth={active('ram')?3:1.8}/>
   {Array.from({length:5},(_,k)=><rect key={k} x={328+i*26} y={103+k*25} width='12' height='14' rx='2' fill='#376c78'/>)}
  </g>)}
  <text x='374' y='76' textAnchor='middle' fill='#bdebd4' fontSize='12' fontWeight='740'>RAM</text>
  <rect x='101' y='282' width='185' height='42' rx='6' fill={fill('ssd')} stroke={stroke('ssd')} strokeWidth={active('ssd')?4:2}/>
  <text x='193' y='308' textAnchor='middle' fill='#ffdfae' fontSize='17' fontWeight='700'>SSD / NVMe</text>
  <rect x='453' y='274' width='63' height='57' rx='6' fill={fill('nic')} stroke={stroke('nic')} strokeWidth={active('nic')?4:2}/>
  <path d='M468 287h32v25h-32zM474 312v9m6-9v9m6-9v9m6-9v9' stroke='#b6a5ff' fill='none' strokeWidth='2'/>
  <text x='484' y='348' textAnchor='middle' fill='#b9b1ff' fontSize='11' fontWeight='750'>RED</text>
  <rect x='461' y='117' width='52' height='123' rx='8' fill={fill('gpu')} stroke={stroke('gpu')} strokeWidth={active('gpu')?4:2}/>
  <circle cx='487' cy='164' r='18' fill='#152c44' stroke='#b88aac' strokeWidth='2'/>
  <path d='M487 146l10 18-10 18-10-18z' fill='#d88dbf' opacity='.85'/>
  <text x='487' y='218' textAnchor='middle' fill='#efc9e7' fontSize='12' fontWeight='750'>GPU</text>
  <circle cx='96' cy='65' r='5' fill='#71dcd4'/><circle cx='508' cy='65' r='5' fill='#71dcd4'/>
  <text x='78' y='18' fill='#8fa8c5' fontSize='12' fontFamily='monospace'>BOARD / ESQUEMA DIDÁCTICO</text>
  <text x='82' y='377' fill='#6e92a8' fontSize='10' fontFamily='monospace'>Representación conceptual · no es un plano electrónico real</text>
 </svg>;
}
export default function HardwareStage({onComplete}:Props){
 const [view,setView]=useState<View>('machine');
 const [part,setPart]=useState<HardwarePartId>('cpu');
 const [journeyStep,setJourneyStep]=useState(0);
 const [fault,setFault]=useState<FaultId>('none');
 const [quizIndex,setQuizIndex]=useState(0);
 const [wrongAnswer,setWrongAnswer]=useState(false);
 const [solved,setSolved]=useState(false);
 const journey:JourneyId=view==='boot'?'boot':'web';
 const steps=JOURNEYS[journey];
 const state=journeyState(journey,journeyStep,view==='web'?fault:'none');
 const activeLayer=state.step.layer;
 const focus=getPart(part);
 const chooseView=(next:View)=>{setView(next);setJourneyStep(0);setFault('none')};
 const chooseFault=(next:FaultId)=>{setFault(next);setJourneyStep(0)};
 const respond=(id:HardwarePartId)=>{
  const correct=quizCorrect(quizIndex,id);
  setWrongAnswer(!correct);
  if(correct){
   if(quizIndex===HARDWARE_QUIZ.length-1){if(!solved){setSolved(true);onComplete()}}
   else setQuizIndex(n=>n+1);
  }
 };
 return <section className='hw-lab' aria-label='Laboratorio de hardware y software'>
  <header className='hw-intro'>
   <div><span className='hw-kicker'>DE LA MÁQUINA A LA EXPERIENCIA</span>
    <h2>¿Qué hay detrás de una app?</h2>
    <p>Elegí una pieza. Seguí el arranque. Después, viajá con una solicitud.</p></div>
   <span className='hw-illustrative'>MODELO INTERACTIVO</span>
  </header>
  <nav className='hw-view-tabs' aria-label='Explorar el sistema'>
   {([['machine','01','La máquina'],['boot','02','Encender'],['web','03','Conectarse']] as const).map(([key,num,label])=>
    <button type='button' key={key} className={view===key?'active':''} aria-pressed={view===key} onClick={()=>chooseView(key)}><span>{num}</span>{label}</button>)}
  </nav>
  {view==='machine'?<div className='hw-machine-layout'>
   <div className='hw-board-panel'><Board selected={part}/><p className='hw-board-caption'>Tocá un componente para descubrir qué hace.</p></div>
   <div className='hw-components'>
    <div className='hw-component-picker' role='group' aria-label='Componentes físicos'>
     {PARTS.map(item=><button key={item.id} type='button' aria-pressed={part===item.id} className={part===item.id?'active':''}
      style={{'--item-color':item.accent} as CSSProperties} onClick={()=>setPart(item.id)}><b>{item.label}</b><small>{item.short}</small></button>)}
    </div>
    <div className='hw-component-detail' style={{'--item-color':focus.accent} as CSSProperties} aria-live='polite'>
     <span>COMPONENTE / {focus.label}</span><h3>{focus.function}</h3>
     <p>{focus.example}</p><small>{focus.avoid}</small>
    </div>
   </div>
  </div>:<div className='hw-journey-layout'>
   <div className='hw-flow-panel'>
    <div className='hw-flow-top'><span>{view==='boot'?'ENCENDIDO → APLICACIÓN':'NAVEGADOR → SERVIDOR → PANTALLA'}</span><strong>{String(journeyStep+1).padStart(2,'0')} / {String(steps.length).padStart(2,'0')}</strong></div>
    <div className='hw-flow-nodes' role='group' aria-label='Etapas del recorrido'>
     {steps.map((item,i)=><button type='button' key={item.heading} aria-pressed={i===journeyStep} className={(i===journeyStep?'active ':'')+(state.blocked&&state.blockIndex===i?'blocked':'')} onClick={()=>setJourneyStep(i)}>
      <span>{String(i+1).padStart(2,'0')}</span><b>{item.heading}</b></button>)}
    </div>
    <div className={'hw-flow-explanation '+(state.blocked?'blocked':'')} aria-live='polite'>
     <span>{state.blocked?'SE DETIENE EL RECORRIDO':state.step.machine==='remote'?'OTRO EQUIPO · SERVIDOR':state.step.machine==='local'?'TU EQUIPO':'DOS EQUIPOS / RED'}</span>
     <h3>{state.headline}</h3><p>{state.blocked?state.reason:state.step.action}</p><small>{state.blocked?'Probá el recorrido sin fallos para continuar.':state.reason}</small>
    </div>
    <div className='hw-flow-actions'><button type='button' disabled={journeyStep===0} onClick={()=>setJourneyStep(s=>Math.max(0,s-1))}>← Atrás</button>
     <button type='button' disabled={journeyStep===steps.length-1} onClick={()=>setJourneyStep(s=>Math.min(steps.length-1,s+1))}>Siguiente paso →</button></div>
    {view==='web'&&<div className='hw-fault-picker' role='group' aria-label='Simular fallos'>
      {([['none','Conexión normal'],['offline','Sin red'],['server','Servidor caído']] as const).map(([key,label])=>
       <button type='button' className={fault===key?'active':''} aria-pressed={fault===key} key={key} onClick={()=>chooseFault(key)}>{label}</button>)}
     </div>}
   </div>
   <div className='hw-layers-panel'>
    <div className='hw-layers-head'>UN MISMO SISTEMA · VARIAS RESPONSABILIDADES</div>
    {[...LAYERS].reverse().map(layer=><div key={layer.id} className={'hw-layer '+(activeLayer===layer.id?'active':'')}
     style={{'--layer-color':layer.accent} as CSSProperties}><span>{layer.name}</span><small>{layer.examples}</small></div>)}
    <p>Las capas representan responsabilidades, no una pila física literal. La red conecta máquinas distintas.</p>
   </div>
  </div>}
  <footer className='hw-footer'>
   <div className='hw-quiz' aria-live='polite'>
    <span className='hw-quiz-caption'>COMPROBÁ LO APRENDIDO · {Math.min(quizIndex+1,HARDWARE_QUIZ.length)}/{HARDWARE_QUIZ.length}</span>
    {solved?<strong>Las tres piezas, identificadas.</strong>:<>
     <strong>{HARDWARE_QUIZ[quizIndex].question}</strong>
     <div className='hw-quiz-answers' role='group' aria-label='Elegir componente'>
      {(['cpu','ram','ssd'] as const).map(id=><button key={id} type='button'
       aria-label={getPart(id).label} onClick={()=>respond(id)}>{getPart(id).label}</button>)}
     </div>
     {wrongAnswer&&<small>Probá otra pieza y mirá su función.</small>}
    </>}
   </div>
   <div className='hw-reference'><a href='https://developer.mozilla.org/es/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works' target='_blank' rel='noopener noreferrer'>Cómo funciona la web ↗</a>
    <a href='https://pages.cs.wisc.edu/~remzi/OSTEP/' target='_blank' rel='noopener noreferrer'>Sistemas operativos ↗</a></div>
  </footer>
 </section>;
}
