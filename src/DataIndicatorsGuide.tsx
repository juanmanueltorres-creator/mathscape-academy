import {useState} from 'react';
import {evidenceLevels,officialIndicators,observations,
 qualityDemo,samplingDemo,cpiToyDemo,purchasingPower,numberFormat,
 type DataExperiment} from './data-indicators';
import './data-indicators.css';

const options:{id:DataExperiment;label:string;description:string}[]=[
 {id:'quality',label:'01 · Calidad',description:'¿Qué pasa con un dato ausente o duplicado?'},
 {id:'sampling',label:'02 · Muestra',description:'¿A quién representan los registros?'},
 {id:'prices',label:'03 · IPC',description:'¿Cuánto influyen los pesos de la canasta?'},
 {id:'purchasing',label:'04 · Salario real',description:'¿Subir nominalmente es ganar poder de compra?'}
];

export default function DataIndicatorsGuide({onComplete}:{onComplete:()=>void}){
 const [active,setActive]=useState<DataExperiment>('quality');
 const [zeroMissing,setZeroMissing]=useState(false);
 const [duplicate,setDuplicate]=useState(false);
 const [sampleB,setSampleB]=useState(70);
 const [housing,setHousing]=useState(20);
 const [nominal,setNominal]=useState(20);
 const [prices,setPrices]=useState(30);
 const [explored,setExplored]=useState<DataExperiment[]>([]);
 const quality=qualityDemo(zeroMissing,duplicate);
 const sample=samplingDemo(sampleB);
 const cpi=cpiToyDemo(housing);
 const real=purchasingPower(nominal,prices);
 const complete=()=>{
  if(explored.includes(active))return;
  const next=[...explored,active];
  setExplored(next);
  if(next.length===options.length)onComplete();
 };
 return <section className="indicator-guide" aria-label="Laboratorio de datos e indicadores">
  <header className="indicator-hero">
   <div><span className="indicator-kicker">G5 / DATOS, ESTADÍSTICA Y EVIDENCIA</span>
    <h2>Del registro al indicador.</h2>
    <p>Un número puede describir un sensor, una empresa o una población. Aprendé qué cambia al limpiar, seleccionar, agrupar y comunicar datos.</p>
   </div>
   <span className="indicator-demo-label">EXPERIMENTOS SIMULADOS · NO CIFRAS OFICIALES</span>
  </header>
  <div className="indicator-levels" aria-label="Niveles de información">
   {evidenceLevels.map((level,index)=><article key={level.label}>
    <span>{String(index+1).padStart(2,'0')} / {level.label}</span>
    <h3>{level.title}</h3>
    <p>{level.example}</p>
    <small>Riesgo: {level.risk}</small>
   </article>)}
  </div>
  <div className="indicator-direction"><strong>El mismo dato no responde cualquier pregunta.</strong>
   <span>Adquirir → validar → definir población y período → calcular → interpretar → decidir.</span></div>
  <div className="indicator-experiments">
   <div className="indicator-experiment-nav" role="group" aria-label="Seleccionar experimento">
    {options.map(option=><button key={option.id} type="button" className={active===option.id?'active':''}
      aria-pressed={active===option.id} onClick={()=>setActive(option.id)}>
      <span>{explored.includes(option.id)?'✓ ':''}{option.label}</span><small>{option.description}</small></button>)}
   </div>
   <div className="indicator-stage" aria-live="polite">
    {active==='quality'&&<article>
     <span className="indicator-kicker">EXPERIMENTO 01 / PROMEDIOS</span>
     <h3>¿Un vacío equivale a cero?</h3>
     <p>Cinco mediciones ficticias de una operación. Una no llegó; no sabemos su valor.</p>
     <div className="indicator-tokens">{[...observations,...(duplicate?[20]:[])].map((v,i)=><span key={i} className={v===null?'unknown':''}>{v===null?'SIN DATO':v}{duplicate&&i===5?' · DUPLICADO':''}</span>)}</div>
     <label className="indicator-check"><input type="checkbox" checked={zeroMissing} onChange={e=>setZeroMissing(e.target.checked)}/>Tratar faltantes como cero (error frecuente)</label>
     <label className="indicator-check"><input type="checkbox" checked={duplicate} onChange={e=>setDuplicate(e.target.checked)}/>Agregar un registro duplicado</label>
     <div className="indicator-numbers"><div><small>PROMEDIO QUE MOSTRARÍAS</small><strong>{numberFormat(quality.value,2)}</strong></div>
      <div><small>REFERENCIA SIN ERRORES</small><strong>{numberFormat(quality.reference,2)}</strong></div></div>
     <p className="indicator-learning">{zeroMissing?'El valor ausente se convirtió indebidamente en cero. ':'El dato faltante se excluye, pero se informa cuántos faltan. '}
      {duplicate?'El duplicado también modifica el promedio.':'La ausencia de datos no demuestra que el evento valiera cero.'} Los resultados dependen de cómo se registró y limpió la información.</p>
    </article>}
    {active==='sampling'&&<article>
     <span className="indicator-kicker">EXPERIMENTO 02 / REPRESENTATIVIDAD</span>
     <h3>¿Tu muestra representa a todos?</h3>
     <p>Población imaginaria: grupo A = 70 %, grupo B = 30 %. Responden «sí» el 20 % de A y el 70 % de B. Modificá cuántas personas de B entran en la muestra.</p>
     <label className="indicator-slider">Participación del grupo B en la muestra <output>{sampleB}%</output>
      <input aria-label="Participación del grupo B en la muestra" type="range" min="0" max="100" step="5" value={sampleB} onChange={e=>setSampleB(Number(e.target.value))}/></label>
     <div className="indicator-numbers"><div><small>POBLACIÓN REAL DEL EJEMPLO</small><strong>{numberFormat(sample.population)}%</strong></div>
      <div><small>RESULTADO MUESTRAL SIN CORRECCIÓN</small><strong>{numberFormat(sample.naiveSample)}%</strong></div></div>
     <p className="indicator-learning">Sesgo observado: {numberFormat(sample.gap,1)} puntos porcentuales respecto de esta población ficticia. Más registros digitales no equivalen necesariamente a mejor representatividad. Las encuestas reales utilizan diseños y ponderaciones más complejos.</p>
    </article>}
    {active==='prices'&&<article>
     <span className="indicator-kicker">EXPERIMENTO 03 / ÍNDICES</span>
     <h3>La misma variación, distinto peso.</h3>
     <p>Simulación simplificada de un promedio ponderado de variaciones de precios. NO reproduce el procedimiento completo del IPC argentino.</p>
     <label className="indicator-slider">Peso hipotético de vivienda <output>{housing}%</output>
      <input aria-label="Peso hipotético de vivienda" type="range" min="10" max="80" step="5" value={housing} onChange={e=>setHousing(Number(e.target.value))}/></label>
     <div className="indicator-weights">{[
      {name:'Alimentos',weight:cpi.food,change:cpi.changes[0]},
      {name:'Vivienda',weight:cpi.housing,change:cpi.changes[1]},
      {name:'Transporte',weight:cpi.transport,change:cpi.changes[2]}
     ].map(item=><div key={item.name}><span>{item.name}<small>Precio: +{item.change}% · Peso: {numberFormat(item.weight)}%</small></span>
       <div className="indicator-track"><span style={{width:`${item.weight}%`}}/></div></div>)}</div>
     <div className="indicator-numbers"><div><small>VARIACIÓN PONDERADA DEL EJEMPLO</small><strong>{numberFormat(cpi.index,2)}%</strong></div>
      <div><small>CON VIVIENDA AL 20 %</small><strong>{numberFormat(cpiToyDemo(20).index,2)}%</strong></div></div>
     <p className="indicator-learning">Cambiar la composición de una canasta modifica su resultado aunque las variaciones por rubro no cambien. Esto es una sensibilidad matemática, no una acusación de manipulación. La metodología, cobertura y series oficiales deben examinarse por separado.</p>
    </article>}
    {active==='purchasing'&&<article>
     <span className="indicator-kicker">EXPERIMENTO 04 / INGRESOS REALES</span>
     <h3>¿Aumentó tu poder adquisitivo?</h3>
     <p>Dos porcentajes ficticios para un mismo período: cambio de salario nominal y cambio de precios.</p>
     <label className="indicator-slider">Variación salarial nominal <output>{nominal}%</output>
      <input aria-label="Variación salarial nominal" type="range" min="-20" max="80" step="5" value={nominal} onChange={e=>setNominal(Number(e.target.value))}/></label>
     <label className="indicator-slider">Variación de precios <output>{prices}%</output>
      <input aria-label="Variación de precios" type="range" min="-20" max="100" step="5" value={prices} onChange={e=>setPrices(Number(e.target.value))}/></label>
     <div className="indicator-numbers"><div><small>CAMBIO DE PODER DE COMPRA</small><strong>{real>=0?'+':''}{numberFormat(real,2)}%</strong></div>
      <div><small>ECUACIÓN</small><strong className="indicator-formula">(1 + s) / (1 + p) − 1</strong></div></div>
     <p className="indicator-learning">Una suba de salario nominal puede coexistir con una caída del salario real. Para comparar datos públicos verificá que ambos índices cubran períodos, poblaciones y metodologías compatibles.</p>
    </article>}
    <div className="indicator-stage-foot"><span>Sin estadísticas ni conexiones en tiempo real. Todos los valores de los experimentos son inventados para aprender.</span>
     <button type="button" disabled={explored.includes(active)} onClick={complete}>{explored.includes(active)?'Experimento explorado ✓':'Marcar explorado ↗'}</button></div>
   </div>
  </div>
  <section className="indicator-official">
   <header><span className="indicator-kicker">DATOS PÚBLICOS / ARGENTINA</span><h2>Cómo leer un indicador del Estado.</h2>
    <p>Estas fuentes sí son oficiales. La guía enseña definiciones y preguntas críticas; no muestra valores actuales ni avala discursos de ningún gobierno u oposición.</p></header>
   <div className="indicator-index-grid">{officialIndicators.map(i=><article key={i.key}>
    <h3>{i.name}</h3><p>{i.what}</p>
    <strong>Cómo se construye</strong><p>{i.how}</p>
    <strong>Qué no concluye</strong><p>{i.caution}</p>
    <a href={i.url} target="_blank" rel="noopener noreferrer">{i.source} ↗</a>
   </article>)}</div>
  </section>
  <footer className="indicator-outro"><div><span className="indicator-kicker">MÉTODO DE AUDITORÍA</span>
   <p>¿Quién produjo los datos? ¿Cuál es el universo y el denominador? ¿Qué se excluyó? ¿Qué fórmula y base usaron? ¿Qué período? ¿Hay revisiones o estimaciones alternativas reproducibles? ¿Qué afirmación no respaldan?</p></div>
   <small>{explored.length} de {options.length} experimentos recorridos. La evidencia precede a la conclusión.</small></footer>
 </section>;
}
