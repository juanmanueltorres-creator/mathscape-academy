import React,{useCallback,useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {drawScene,observations,type Chapter,type Params} from './canvas';
import './styles.css';
const CHAPTERS:{id:Chapter,tab:string,eyebrow:string,title:string,description:string,question:string,solution:string,controls:{key:keyof Params,label:string,min:number,max:number,step:number}[]}[]=[
 {id:'base',tab:'Repaso',eyebrow:'00 · FUNDAMENTOS ESENCIALES',title:'Una recta, dos decisiones',description:'Mové los coeficientes. La misma función se expresa como fórmula, gráfica y tasa de cambio.',question:'Construí una recta con pendiente 2 que cruce el eje y en −1.',solution:'La pendiente es el cambio de y por cada unidad de x. La ordenada es f(0).',controls:[{key:'m',label:'Pendiente m',min:-3,max:3,step:.25},{key:'b',label:'Ordenada b',min:-3,max:3,step:.25}]},
 {id:'derivative',tab:'Derivadas',eyebrow:'01 · CÁLCULO DIFERENCIAL',title:'La pendiente de un instante',description:'Acercá dos puntos de una parábola. La secante se aproxima a la recta tangente cuando h tiende a cero.',question:'Conseguí que la diferencia entre la pendiente secante y la tangente sea menor que 0,11.',solution:'Para f(x)=x², la secante tiene pendiente 2x₀+h y la tangente pendiente 2x₀. La diferencia es |h|.',controls:[{key:'x0',label:'Punto x₀',min:-2,max:2,step:.25},{key:'h',label:'Separación h',min:.05,max:2,step:.05}]},
 {id:'integral',tab:'Integrales',eyebrow:'02 · CÁLCULO INTEGRAL',title:'Lo infinito en pequeñas sumas',description:'Dividí el área bajo una curva en rectángulos. Aumentá su cantidad y observá cómo converge la suma.',question:'Lográ que el error absoluto de la suma izquierda sea menor a 0,06.',solution:'El ancho de cada rectángulo es Δx=(b−a)/n. La suma ∑ f(a+iΔx)Δx aproxima la integral.',controls:[{key:'upper',label:'Límite superior b',min:1,max:3,step:.25},{key:'n',label:'Rectángulos n',min:2,max:80,step:1}]},
 {id:'matrix',tab:'Matrices',eyebrow:'03 · ÁLGEBRA LINEAL',title:'Transformá el espacio',description:'Modificá una matriz 2×2 para observar cómo cambian la grilla, los vectores y el área del cuadrado unidad.',question:'Buscá una matriz singular: hacé que el determinante sea cero.',solution:'Una matriz 2×2 es singular cuando ad−bc=0. Su transformación aplasta el plano en una dimensión menor.',controls:[{key:'a',label:'Matriz a₁₁',min:-2,max:2,step:.25},{key:'mb',label:'Matriz a₁₂',min:-2,max:2,step:.25},{key:'c',label:'Matriz a₂₁',min:-2,max:2,step:.25},{key:'d',label:'Matriz a₂₂',min:-2,max:2,step:.25}]}
];
const INITIAL:Params={m:1,b:0,x0:1,h:1,n:8,upper:2,a:1,mb:.25,c:0,d:1};
function App(){
 const [chapter,setChapter]=useState<Chapter>('derivative');
 const [params,setParams]=useState<Params>(INITIAL);
 const [answer,setAnswer]=useState<'idle'|'correct'|'retry'|'hint'>('idle');
 const [completed,setCompleted]=useState<Chapter[]>([]);
 const canvas=useRef<HTMLCanvasElement|null>(null);
 const lesson=CHAPTERS.find(x=>x.id===chapter)!;
 const data=observations(chapter,params);
 const render=useCallback(()=>{if(canvas.current)drawScene(canvas.current,chapter,params)},[chapter,params]);
 useEffect(()=>{render();const observer=new ResizeObserver(render);if(canvas.current)observer.observe(canvas.current);return()=>observer.disconnect()},[render]);
 const update=(key:keyof Params,value:number)=>{setParams(prev=>({...prev,[key]:value}));setAnswer('idle')};
 const change=(id:Chapter)=>{setChapter(id);setAnswer('idle')};
 const check=()=>{setAnswer(data.pass?'correct':'retry');if(data.pass)setCompleted(old=>old.includes(chapter)?old:[...old,chapter])};
 return <div className="shell">
  <header className="top"><div className="brand"><span className="infinity">∞</span> Mathscape <small>/ ACADEMY</small></div><div className="score"><span className="score-dot"/> {completed.length} de 4 experiencias</div></header>
  <section className="hero"><div className="eyebrow">LABORATORIO DE CONOCIMIENTO · 2026</div><h1>No memorices la fórmula. <em>Hacé que cobre vida.</em></h1><p>Un recorrido visual por cálculo y álgebra lineal. Cambiá variables, formulá una hipótesis y observá la matemática en acción.</p></section>
  <nav className="tabs" aria-label="Capítulos de matemática">{CHAPTERS.map((item,i)=><button type="button" key={item.id} className={'tab '+(chapter===item.id?'selected':'')} onClick={()=>change(item.id)} aria-current={chapter===item.id?'step':undefined}><span>{String(i).padStart(2,'0')}</span> {item.tab}{completed.includes(item.id)&&' ✓'}</button>)}</nav>
  <main className="workspace"><section className="visual" aria-label="Visualización matemática en un plano cartesiano"><div className="visual-head"><div><span className="micro">EXPERIMENTO INTERACTIVO</span><strong>{chapter==='matrix'?'TRANSFORMACIÓN LINEAL':chapter==='integral'?'ACUMULACIÓN':chapter==='base'?'FUNCIÓN LINEAL':'SECANTE → TANGENTE'}</strong></div><span className="live"><i/> EN VIVO</span></div><canvas ref={canvas} aria-label="Plano cartesiano con curvas o transformaciones que responden a los controles"/><div className="visual-foot"><code>{data.formula}</code><span>Canvas 2D · Matemáticas reales</span></div></section>
  <section className="right"><div className="card controls"><span className="micro accent">{lesson.eyebrow}</span><h2>{lesson.title}</h2><p>{lesson.description}</p><div className="sliders">{lesson.controls.map(c=><label className="slider" key={c.key}><span>{c.label}<b>{Number(params[c.key].toFixed(2)).toLocaleString('es-AR')}</b></span><input type="range" min={c.min} max={c.max} step={c.step} value={params[c.key]} onChange={e=>update(c.key,Number(e.currentTarget.value))}/></label>)}</div><div className="metric-grid">{data.metrics.map(m=><div className="metric" key={m.label}><span>{m.label}</span><strong>{m.value}</strong></div>)}</div><div className="insight"><span>LO QUE ESTÁS OBSERVANDO</span><p>{data.message}</p></div></div>
  <div className="card challenge"><span className="micro">✦ APRENDER HACIENDO</span><h3>Tu desafío</h3><p>{lesson.question}</p><div className="buttons"><button type="button" className="primary" onClick={check}>Comprobar resultado</button><button type="button" className="secondary" onClick={()=>setAnswer('hint')}>Ver pista</button></div><div className={'feedback '+(answer==='correct'?'correct':'')} aria-live="polite">{answer==='hint'?data.hint:answer==='correct'?'✓ Resuelto. '+lesson.solution:answer==='retry'?'Todavía no: ajustá los controles y observá el cambio.':'Experimentá antes de comprobar tu respuesta.'}</div></div></section></main>
  <footer>MATEMÁTICA / DISEÑO GENERATIVO / INTERACCIÓN <span>Sin Blender · Sin Three.js · React + Canvas</span></footer>
 </div>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
