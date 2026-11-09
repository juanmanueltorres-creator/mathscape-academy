import {useState} from 'react';

type Lineage={period:string;old:string;now:string;status:'Continuidad'|'Extensión'|'Mecanismo diferente';question:string;explanation:string;distinction:string;link:string;source:string};
const lineage:Lineage[]=[
 {period:'1960–1998',old:'Requisitos y especificaciones (SRS)',now:'Spec-driven development',status:'Extensión',question:'¿Es nuevo escribir qué debe hacer el software?',explanation:'La ingeniería de requisitos lleva décadas formalizando comportamientos, restricciones y aceptación. La especificación no nació con la IA.',distinction:'En los flujos actuales, esos documentos también orientan a agentes que generan cambios y pueden contrastarlos con pruebas. No implica volver al modelo en cascada.',link:'https://standards.ieee.org/ieee/830/1222/',source:'IEEE 830-1998 · especificaciones de requisitos'},
 {period:'1970–2000',old:'Interfaces, plugins y llamadas a procedimientos',now:'Tool calling y MCP',status:'Extensión',question:'¿Siempre hubo programas que invocaban otros programas?',explanation:'Los contratos de interfaz, protocolos y llamadas remotas ya conectaban sistemas diferentes.',distinction:'MCP (2024) estandariza la conexión entre aplicaciones con modelos/asistentes y herramientas o fuentes de contexto. El protocolo y la selección probabilística de herramientas no son sinónimos de una API clásica.',link:'https://www.anthropic.com/news/model-context-protocol',source:'Anthropic · presentación de MCP, 2024'},
 {period:'1960–2020',old:'Búsqueda de información y recuperación documental',now:'RAG',status:'Extensión',question:'¿Buscar antes de responder es una idea nueva?',explanation:'La recuperación de información es anterior a la IA generativa. Indexar, rankear y recuperar documentos son técnicas con larga historia.',distinction:'RAG une recuperación con generación condicionada por lo encontrado. No equivale a una simple búsqueda ni garantiza que la respuesta sea verdadera.',link:'https://arxiv.org/abs/2005.11401',source:'Lewis et al. · Retrieval-Augmented Generation, 2020'},
 {period:'1990–2020',old:'Scripts, pipelines y CI/CD',now:'Ciclos de agentes con tests',status:'Mecanismo diferente',question:'¿Un agente es solamente un script más largo?',explanation:'Automatizar compilar, probar y desplegar ya era una práctica consolidada. Los pipelines ejecutan pasos previamente definidos.',distinction:'Un agente puede proponer y seleccionar acciones en un bucle, con decisiones no completamente predeterminadas. Por eso importan permisos, observabilidad y revisión humana.',link:'https://arxiv.org/abs/2210.03629',source:'Yao et al. · ReAct, 2022'},
 {period:'1990–2026',old:'README, guías de contribución y convenciones',now:'AGENTS.md e instrucciones para agentes',status:'Continuidad',question:'¿Qué cambia cuando las guías tienen otro lector?',explanation:'Los proyectos siempre necesitaron reglas para colaboradores: estructura, estilo, pruebas, decisiones y prohibiciones.',distinction:'Los archivos orientados a agentes colocan esas instrucciones donde las herramientas pueden descubrirlas. Su utilidad depende de que estén actualizadas y no contradigan el código.',link:'https://agents.md/',source:'AGENTS.md · formato para instrucciones de agentes'},
 {period:'1960–2026',old:'Planificación, delegación y concurrencia',now:'Orquestación multiagente',status:'Extensión',question:'¿Coordinación es igual a inteligencia?',explanation:'La división de tareas, los procesos concurrentes y la supervisión existen desde mucho antes de los modelos actuales.',distinction:'Con agentes que generan acciones, aparecen incertidumbre, conflictos de archivos, prompts no confiables y nuevas exigencias de control. Más agentes no garantizan mejores resultados.',link:'https://github.github.com/spec-kit/',source:'GitHub Spec Kit · flujos verificables'},
];
export default function SoftwareHistoryGuide({onComplete}:{onComplete:()=>void}){
 const [current,setCurrent]=useState(0);
 const [visited,setVisited]=useState<number[]>([]);
 const [result,setResult]=useState('');
 const selected=lineage[current];
 const choose=(i:number)=>{setCurrent(i);setResult('')};
 const mark=()=>{
  const next=visited.includes(current)?visited:[...visited,current];setVisited(next);
  setResult(next.length===lineage.length?'Recorrido completo: reconociste continuidad y cambios de mecanismo.':'Relación examinada. Podés comparar otro concepto.');
  if(next.length===lineage.length)onComplete();
 };
 return <section className="ai-guide software-history" aria-label="Historia de conceptos del software">
  <div className="history-intro"><span className="ai-kicker">HISTORIA DE IDEAS / NUEVAS HERRAMIENTAS</span><h2>La técnica cambia. Algunas preguntas permanecen.</h2><p>Antes de comparar nombres, conviene comparar qué problema resuelven, qué mecanismo usan y qué evidencia permiten verificar.</p></div>
  <div className="history-grid">
   <nav className="history-timeline" aria-label="Conceptos a través del tiempo">{lineage.map((item,i)=><button type="button" key={item.now} aria-pressed={current===i} className={current===i?'active':''} onClick={()=>choose(i)}><small>{item.period}</small><strong>{item.old}</strong><span>{item.now}</span>{visited.includes(i)&&<span className="history-check" aria-label="Explorado">✓</span>}</button>)}</nav>
   <article className="history-detail">
    <span className="ai-kicker">{selected.status.toUpperCase()} · {selected.period}</span>
    <h3>{selected.question}</h3>
    <div className="history-comparison"><div><span>ANTES</span><strong>{selected.old}</strong></div><div className="history-arrow" aria-hidden="true">⇄</div><div><span>HOY</span><strong>{selected.now}</strong></div></div>
    <div className="history-reading"><div><span>LO QUE PERMANECE</span><p>{selected.explanation}</p></div><div><span>LO QUE CAMBIA</span><p>{selected.distinction}</p></div></div>
    <a href={selected.link} target="_blank" rel="noreferrer" className="history-source">Fuente y contexto: {selected.source} ↗</a>
    <div className="ai-challenge"><span>COMPROBAR LA DIFERENCIA</span><p>¿Podés distinguir la idea anterior del mecanismo actual?</p><button type="button" onClick={mark}>Entendido · siguiente relación ↗</button><p role="status">{result}</p></div>
   </article>
  </div>
  <p className="ai-sources">Las fechas señalan antecedentes documentados, no fechas únicas de invención. «Continuidad», «extensión» y «mecanismo diferente» son categorías editoriales para razonar, no calificaciones comerciales.</p>
 </section>
}
