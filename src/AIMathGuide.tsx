import {useState} from 'react';
import {attention,descentStep,neuron,regressionLoss} from './ai-math';

type Mode='neuron'|'learn'|'attention';
const modes:[Mode,string,string][]=[['neuron','01 · Neurona','Una suma que decide'],['learn','02 · Aprendizaje','Reducir el error'],['attention','03 · Atención','Comparar vectores']];
const format=(v:number,d=3)=>v.toLocaleString('es-AR',{maximumFractionDigits:d});
const Slider=({label,value,min,max,step,onChange}:{label:string;value:number;min:number;max:number;step:number;onChange:(n:number)=>void})=><label className="ai-slider"><span>{label}<output>{format(value,2)}</output></span><input type="range" value={value} min={min} max={max} step={step} onChange={e=>onChange(Number(e.target.value))}/></label>;

export default function AIMathGuide({onComplete}:{onComplete:()=>void}){
 const [mode,setMode]=useState<Mode>('neuron');
 const [x1,setX1]=useState(1),[x2,setX2]=useState(.5),[w1,setW1]=useState(1),[w2,setW2]=useState(-.5),[bias,setBias]=useState(0);
 const [rate,setRate]=useState(.7),[steps,setSteps]=useState(0);
 const [angle,setAngle]=useState(0),[temperature,setTemperature]=useState(1);
 const [solved,setSolved]=useState<Mode[]>([]),[feedback,setFeedback]=useState('');
 const n=neuron([x1,x2],[w1,w2],bias);
 let w=-1;for(let i=0;i<steps;i++)w=descentStep(w,rate).next;
 const loss=regressionLoss(w),a=attention(angle,temperature);
 const passed=mode==='neuron'?n.probability>.75:mode==='learn'?loss<.02:Math.max(...a.weights)>.65;
 const check=()=>{
  if(!passed){setFeedback('Todavía no: mové una variable y contrastá el resultado.');return}
  const next=solved.includes(mode)?solved:[...solved,mode];setSolved(next);
  setFeedback(next.length===3?'Tres mecanismos explorados y comprobados.':'Resultado comprobado. Seguí con el siguiente mecanismo.');
  if(next.length===3)onComplete();
 };
 const select=(key:Mode)=>{setMode(key);setFeedback('')};
 const lossPath=Array.from({length:81},(_,i)=>{const p=-2+i*7/80;return `${i?'L':'M'}${48+(p+2)*92},${275-regressionLoss(p)*29}`}).join(' ');
 return <section className="ai-guide" aria-label="Guía interactiva de matemática de la inteligencia artificial">
  <div className="ai-tabs" role="group" aria-label="Mecanismos matemáticos">{modes.map(([key,tag])=><button type="button" key={key} className={mode===key?'active':''} aria-pressed={mode===key} onClick={()=>select(key)}>{tag}{solved.includes(key)?' ✓':''}</button>)}</div>
  <div className="ai-layout">
   <div className="ai-panel">
    <div className="ai-graphic-header"><span>MODELO MATEMÁTICO / ILUSTRACIÓN DETERMINISTA</span><strong>{modes.find(x=>x[0]===mode)?.[2]}</strong></div>
    <svg className="ai-diagram" viewBox="0 0 760 340" role="img" aria-label={mode==='neuron'?'Dos entradas ponderadas producen una suma y una probabilidad por sigmoide':mode==='learn'?'La pérdida cuadrática y el peso cambiante por descenso de gradiente':'Tres claves reciben probabilidades normalizadas según un producto escalar'}>
     <defs><linearGradient id="ai-fill" x1="0" x2="1"><stop offset="0" stopColor="#65d9e9" stopOpacity=".65"/><stop offset="1" stopColor="#c1a2fa" stopOpacity=".9"/></linearGradient></defs>
     {mode==='neuron'?<g>
      <line x1="148" y1="95" x2="348" y2="168" stroke="#83d4ed" strokeWidth={1+Math.abs(w1)*2}/><line x1="148" y1="245" x2="348" y2="168" stroke="#bfabea" strokeWidth={1+Math.abs(w2)*2}/><line x1="430" y1="168" x2="580" y2="168" stroke="#8adecb" strokeWidth="3"/>
      {[[110,95,`x₁ = ${format(x1,2)}`],[110,245,`x₂ = ${format(x2,2)}`],[390,168,`z = ${format(n.z)}`],[640,168,`${format(n.probability*100,1)} %`]].map(([cx,cy,txt],i)=><g key={i}><circle cx={Number(cx)} cy={Number(cy)} r={i===2?53:42} stroke={i===2?'#c8adfa':'#78e3e5'} fill="#101e36" strokeWidth="2"/><text x={Number(cx)} y={Number(cy)+4} fill="#e7f2ff" fontSize={i===3?18:14} textAnchor="middle">{txt}</text></g>)}
      <text x="230" y="113" fill="#91dced" fontSize="16">× {format(w1,2)}</text><text x="230" y="243" fill="#c5adee" fontSize="16">× {format(w2,2)}</text><text x="390" y="244" fill="#aebbd4" textAnchor="middle" fontSize="15">+ sesgo {format(bias,2)}</text><text x="640" y="241" fill="#aebbd4" textAnchor="middle" fontSize="15">sigmoide</text>
      <rect x="505" y="285" width="240" height="12" rx="6" fill="#25354c"/><rect x="505" y="285" width={240*n.probability} height="12" rx="6" fill="url(#ai-fill)"/>
     </g>:mode==='learn'?<g>
      <line x1="48" y1="280" x2="707" y2="280" stroke="#607493"/><line x1="48" y1="30" x2="48" y2="280" stroke="#607493"/>
      <path d={lossPath} stroke="#83e0ee" strokeWidth="4" fill="none"/>
      <line x1={48+(w+2)*92} y1="278" x2={48+(w+2)*92} y2={275-loss*29} stroke="#baa5f2" strokeDasharray="5 5" strokeWidth="2"/>
      <circle cx={48+(w+2)*92} cy={275-loss*29} r="10" fill="#e8bdfb" stroke="#0e1728" strokeWidth="3"/>
      <text x="54" y="23" fontSize="15" fill="#adc1dc">Error cuadrático medio</text><text x="704" y="312" textAnchor="end" fontSize="15" fill="#adc1dc">Peso w</text>
      <text x={48+(w+2)*92} y={Math.max(30,267-loss*29)} textAnchor="middle" fontSize="17" fill="#f2daff">w = {format(w,3)}</text>
      <text x={48+(2+2)*92} y="315" textAnchor="middle" fontSize="14" fill="#8bddc7">óptimo = 2</text>
     </g>:<g>
      <text x="55" y="44" fill="#b7c7dd" fontSize="16">consulta q = [{format(a.q[0],2)}, {format(a.q[1],2)}]</text>
      {a.weights.map((weight,i)=>{const x=125+i*215,y=264-weight*193;return <g key={i}>
       <rect x={x} y="72" width="128" height="194" rx="9" fill="#15243b" stroke="#334764"/>
       <rect x={x} y={y} width="128" height={264-y} rx="9" fill={i===0?'#6dccda':i===1?'#b3a0ec':'#8dc8a0'}/>
       <text x={x+64} y={Math.max(56,y-12)} fill="#e8f2ff" fontSize="22" textAnchor="middle">{format(weight*100,1)} %</text><text x={x+64} y="291" fill="#d1ddef" fontSize="16" textAnchor="middle">Clave {['A','B','C'][i]}</text><text x={x+64} y="312" fill="#90a1bc" fontSize="13" textAnchor="middle">score {format(a.logits[i],2)}</text>
      </g>})}
     </g>}
    </svg>
    <div className="ai-insight" aria-live="polite"><span>OBSERVACIÓN</span><p>{mode==='neuron'?`z = ${format(n.z)}; σ(z) = ${format(n.probability)}. Cambiar pesos modifica la influencia de cada entrada, no el significado de las entradas.`:mode==='learn'?`Tras ${steps} pasos: peso = ${format(w)}, error = ${format(loss,4)}. El mínimo de este ejemplo está en w = 2.`:`softmax suma ${format(a.weights.reduce((s,v)=>s+v,0))}. Salida ponderada = [${format(a.output[0])}, ${format(a.output[1])}].`}</p></div>
   </div>
   <aside className="ai-controls">
    <span className="ai-kicker">PROBAR · OBSERVAR · COMPROBAR</span>
    <h2>{mode==='neuron'?'La salida no aparece por magia.':mode==='learn'?'Una derivada señala el camino.':'La relevancia se convierte en pesos.'}</h2>
    <p>{mode==='neuron'?'Dos números atraviesan una suma ponderada y una función no lineal. Esto representa una sola neurona, no un modelo de lenguaje.':mode==='learn'?'Un peso intenta ajustar tres puntos sintéticos con una recta. La derivada del error indica hacia dónde corregirlo.':'Una consulta compara su dirección con tres claves. Softmax asigna pesos y combina los valores. Las claves son vectores ilustrativos, no palabras interpretadas.'}</p>
    <div className="ai-formula">{mode==='neuron'?'z = w₁x₁ + w₂x₂ + b  ·  σ(z) = 1/(1+e⁻ᶻ)':mode==='learn'?'L(w) = promedio[(wx−2x)²] · wₜ₊₁ = wₜ − ηL′(wₜ)':'Attention(q,K,V) = softmax(qKᵀ / √2T) V'}</div>
    {mode==='neuron'?<div className="ai-sliders"><Slider label="Entrada x₁" min={-1} max={1} step={.1} value={x1} onChange={setX1}/><Slider label="Entrada x₂" min={-1} max={1} step={.1} value={x2} onChange={setX2}/><Slider label="Peso w₁" min={-3} max={3} step={.1} value={w1} onChange={setW1}/><Slider label="Peso w₂" min={-3} max={3} step={.1} value={w2} onChange={setW2}/><Slider label="Sesgo b" min={-2} max={2} step={.1} value={bias} onChange={setBias}/></div>:mode==='learn'?<div className="ai-sliders"><Slider label="Tasa de aprendizaje η" min={.1} max={1.2} step={.1} value={rate} onChange={setRate}/><div className="ai-step-actions"><button type="button" onClick={()=>{setSteps(n=>Math.min(40,n+1));setFeedback('')}}>Un paso →</button><button type="button" onClick={()=>{setSteps(n=>Math.min(40,n+10));setFeedback('')}}>Diez pasos ↠</button><button type="button" onClick={()=>{setSteps(0);setFeedback('')}}>Reiniciar</button></div></div>:<div className="ai-sliders"><Slider label="Ángulo de consulta (°)" min={0} max={360} step={5} value={angle} onChange={setAngle}/><Slider label="Temperatura T" min={.4} max={2} step={.1} value={temperature} onChange={setTemperature}/></div>}
    <div className="ai-challenge"><span>MICRODESAFÍO</span><p>{mode==='neuron'?'Conseguí que la salida supere el 75 %.':mode==='learn'?'Reducí el error cuadrático medio por debajo de 0,02.':'Concentrá más del 65 % en una sola clave.'}</p><button type="button" onClick={check}>Comprobar ↗</button><p role="status">{feedback}</p></div>
   </aside>
  </div>
  <div className="ai-bridges"><strong>La idea continúa en</strong><span>01 · Funciones</span><span>03 · Derivadas</span><span>06 · Matrices</span><span>07 · Ecuaciones diferenciales</span></div>
  <p className="ai-sources">Modelo didáctico calculado en el navegador. No predice lenguaje ni representa el entrenamiento de un LLM. Referencias: <a href="https://www.nature.com/articles/323533a0" target="_blank" rel="noreferrer">Rumelhart, Hinton y Williams (1986)</a> · <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">Vaswani et al. (2017)</a>.</p>
 </section>
}
