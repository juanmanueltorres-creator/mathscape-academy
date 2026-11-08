import {useState,type CSSProperties} from 'react';
import {CONTRACT_CASES,contractById,evaluateContract,presetBody,type ContractId,type ContractResponse,type PresetId} from './api-contract';

type Props={onComplete:()=>void};
const examples:readonly {key:PresetId;label:string}[]=[
 {key:'valid',label:'Correcto'},
 {key:'missing',label:'Falta un dato'},
 {key:'invalid',label:'Regla inválida'},
 {key:'syntax',label:'JSON roto'}
];
export default function ApiContractStage({onComplete}:Props){
 const [caseId,setCaseId]=useState<ContractId>('terrain');
 const [body,setBody]=useState(()=>presetBody('terrain','valid'));
 const [active,setActive]=useState<PresetId|'custom'>('valid');
 const [result,setResult]=useState<ContractResponse|null>(null);
 const [seenRejected,setSeenRejected]=useState(false);
 const [solved,setSolved]=useState(false);
 const current=contractById(caseId);
 const chooseCase=(id:ContractId)=>{
  setCaseId(id);setBody(presetBody(id,'valid'));setActive('valid');
  setResult(null);setSeenRejected(false);setSolved(false);
 };
 const preset=(key:PresetId)=>{
  setBody(presetBody(caseId,key));setActive(key);setResult(null);
 };
 const send=()=>{
  const answer=evaluateContract(caseId,body);
  setResult(answer);
  if(!answer.ok)setSeenRejected(true);
  else if(seenRejected&&!solved){setSolved(true);onComplete();}
 };
 return <section className='api-lab' style={{'--api-accent':current.accent} as CSSProperties} aria-label='Laboratorio de contratos de API'>
  <header className='api-lab-head'>
   <div><span className='api-kicker'>TRES PRODUCTOS · UN CONTRATO</span>
    <h2>{current.goal}</h2>
    <p>El cliente propone. El servidor decide qué acepta.</p></div>
   <span className='api-sim-label'>SIN CONEXIÓN EXTERNA</span>
  </header>
  <nav className='api-case-tabs' aria-label='Elegir solicitud'>{CONTRACT_CASES.map(item=><button type='button' key={item.id} className={item.id===caseId?'active':''} aria-pressed={item.id===caseId} onClick={()=>chooseCase(item.id)}>
    <small>{item.context}</small><strong>{item.name}</strong>
   </button>)}</nav>
  <div className='api-lab-columns'>
   <div className='api-editor-panel'>
    <div className='api-panel-head'><div><span>01 / SOLICITUD</span><strong>{current.endpoint}</strong></div><span className='api-format'>application/json</span></div>
    <div className='api-preset-list' role='group' aria-label='Ejemplos del contrato'>{examples.map(option=><button key={option.key} type='button' className={active===option.key?'active':''} aria-pressed={active===option.key} onClick={()=>preset(option.key)}>{option.label}</button>)}</div>
    <label className='api-edit-label' htmlFor='api-json-body'>Cuerpo de la solicitud</label>
    <textarea id='api-json-body' className='api-code-input' value={body} onChange={e=>{setBody(e.target.value);setActive('custom');setResult(null)}} spellCheck={false} maxLength={4000} aria-describedby='api-body-hint'/>
    <div className='api-editor-bottom'><small id='api-body-hint'>Editá los campos o probá un ejemplo.</small><button className='api-send' type='button' onClick={send}>Enviar solicitud <span>↗</span></button></div>
   </div>
   <div className='api-response-panel'>
    <div className='api-panel-head'><div><span>02 / RESPUESTA</span><strong>El servidor verifica</strong></div><span className={'api-status '+(result?.ok?'ok':result?'error':'idle')}>{result?result.status:'···'}</span></div>
    <div className='api-contract-steps' aria-label='Etapas de validación'>
     <div className={result&&result.phase!=='syntax'?'ok':result?'failed':''}><b>01</b><span>Sintaxis JSON</span></div>
     <div className={result&&['rule','accepted'].includes(result.phase)?'ok':result&&result.phase==='structure'?'failed':''}><b>02</b><span>Contrato</span></div>
     <div className={result&&result.phase==='accepted'?'ok':result&&result.phase==='rule'?'failed':''}><b>03</b><span>Reglas</span></div>
    </div>
    <div className={'api-verdict '+(result?.ok?'ok':result?'error':'idle')} aria-live='polite'>
     <span className='api-verdict-tag'>{result?result.ok?'SOLICITUD VÁLIDA':'SOLICITUD RECHAZADA':'LISTO PARA PROBAR'}</span>
     <h3>{result?result.title:'¿Qué contesta el servidor?'}</h3>
     <p>{result?result.message:'Probá un campo faltante. Después corregilo.'}</p>
    </div>
    <pre className='api-response-code' aria-label='Respuesta JSON'><code>{result?.responseJson||'// La respuesta aparece al enviar.'}</code></pre>
    <div className='api-insight'><span>POR QUÉ IMPORTA</span><p>{current.insight}</p></div>
   </div>
  </div>
  <footer className='api-lab-footer'>
   <div className='api-challenge' role='status'><span>{solved?'✓':seenRejected?'02 / 02':'01 / 02'}</span><p>{solved?'Un contrato claro evita errores invisibles.':seenRejected?'Ahora corregí el cuerpo y enviá de nuevo.':'Desafiá el contrato: provocá un error y después corregilo.'}</p></div>
   <a href='https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status' target='_blank' rel='noopener noreferrer'>Códigos HTTP ↗</a>
  </footer>
 </section>;
}
