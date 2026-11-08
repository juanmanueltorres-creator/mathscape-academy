import React,{Suspense,useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {defaults,lessons,functionFamilies,type SceneId} from './content';
import {examples} from './examples';
import {calculate} from './measure';
import {drawScene} from './visuals';
import './styles.css';

const TerrainThree=React.lazy(()=>import('./TerrainThree'));
const number=(n:number)=>Number(n.toFixed(2)).toLocaleString('es-AR');
const groups=[{label:'DESCUBRIR',ids:['atlas','functions','limits']},{label:'CÁLCULO',ids:['derivative','integral','double']},{label:'ESTRUCTURAS',ids:['matrix','ode','gradient']},{label:'APLICACIONES',ids:['terrain']},{label:'ATLAS GEOESPACIAL',ids:['projection','raster','sensors']}];
const sceneName:Record<string,string>={atlas:'Generative field',functions:'Coordinate study',limits:'Continuity / limit',derivative:'Instantaneous change',integral:'Area accumulation',double:'Volume accumulation',matrix:'Linear transformation',ode:'Dynamic systems',gradient:'Slope field',terrain:'Terrain analysis / synthetic DEM',projection:'From sphere to map',raster:'Pixel & vector field',sensors:'Multispectral interpretation'};

type AtlasFocus='lissajous'|'lorenz'|'gielis';
function Stage({scene,params,accent,playing,focus,resetKey}:{scene:SceneId;params:Record<string,number>;accent:string;playing:boolean;focus:AtlasFocus;resetKey:number}){
 const canvas=useRef<HTMLCanvasElement|null>(null);
 const angle=useRef(-.73),time=useRef(0),drag=useRef<{x:number;angle:number}|null>(null);
 const animate=useCallback(()=>{if(canvas.current)drawScene(canvas.current,scene,params,{angle:angle.current,time:time.current,focus},accent)},[scene,params,accent,focus]);
 useEffect(()=>{angle.current=-.73;time.current=0;animate()},[scene,resetKey]);
 useEffect(()=>{
  const node=canvas.current;if(!node)return;
  const r=new ResizeObserver(animate);r.observe(node);animate();return()=>r.disconnect();
 },[animate]);
 useEffect(()=>{
  // Escenas estáticas: dibujar sólo al cambiar parámetros, tamaño o cámara.
  if(!playing||scene!=='atlas'){animate();return}
  const node=canvas.current;if(!node)return;
  let raf=0,last=0,visible=true;
  const stop=()=>{if(raf)cancelAnimationFrame(raf);raf=0};
  const loop=(stamp:number)=>{
   raf=0;
   if(document.hidden||!visible)return;
   if(stamp-last>=50){time.current+=Math.min(.07,(stamp-last||50)/1000)*.75;animate();last=stamp}
   raf=requestAnimationFrame(loop);
  };
  const start=()=>{if(!raf&&!document.hidden&&visible)raf=requestAnimationFrame(loop)};
  const onVisibility=()=>document.hidden?stop():start();
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else stop()},{threshold:0});
  observer.observe(node);document.addEventListener('visibilitychange',onVisibility);start();
  return()=>{stop();observer.disconnect();document.removeEventListener('visibilitychange',onVisibility)};
 },[playing,scene,animate]);
 const down=(e:React.PointerEvent<HTMLCanvasElement>)=>{
  if(!['atlas','double','gradient','terrain'].includes(scene)||(scene==='terrain'&&params.terrainView===1))return;
  drag.current={x:e.clientX,angle:angle.current};e.currentTarget.setPointerCapture(e.pointerId);
 };
 const move=(e:React.PointerEvent<HTMLCanvasElement>)=>{if(!drag.current)return;angle.current=drag.current.angle+(e.clientX-drag.current.x)*.008;animate()};
 const up=()=>{drag.current=null};
 return <canvas ref={canvas} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label={scene==='projection'?'Globo y proyecciones con retícula y distorsión local':scene==='raster'?'Ráster sintético de elevación y vectores ilustrativos':scene==='sensors'?'Bandas ópticas sintéticas e índices espectrales':scene==='terrain'?'Terreno sintético con malla de elevación y perfil topográfico':scene==='double'?'Superficie matemática z igual a uno más amplitud por x cuadrado más y cuadrado':scene==='atlas'?'Composición generativa animada de atractor Lorenz, Lissajous y superfórmula':'Gráfico matemático de '+sceneName[scene]}/>;
}
function App(){
 const [scene,setScene]=useState<SceneId>('functions');
 const [params,setParams]=useState<Record<string,number>>({...defaults});
 const [done,setDone]=useState<SceneId[]>([]);
 const [response,setResponse]=useState<'idle'|'correct'|'retry'|'hint'>('idle');
 const [playing,setPlaying]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [focus,setFocus]=useState<AtlasFocus>('lissajous');
 const [resetKey,setResetKey]=useState(0);
 const [mobileMenu,setMobileMenu]=useState(false);
 const current=lessons.find(l=>l.id===scene)!;
 const sceneExamples=examples[scene]||[];
 const modelIndex=scene==='atlas'?params.atlasModel||0:scene==='double'?params.doubleModel||0:0;
 const family=Math.max(0,Math.min(4,Math.round(params.family||0)));
 const familyMeta=functionFamilies[family];
 const info=useMemo(()=>calculate(scene,params),[scene,params]);
 const completeCount=done.length;
 const style={'--accent':current.accent} as React.CSSProperties;
 const select=(id:SceneId)=>{setScene(id);setResponse('idle');setMobileMenu(false);};
 const update=(key:string,value:number)=>{setParams(prev=>({...prev,[key]:value}));setResponse('idle')};
 const applyExample=(values:Record<string,number>)=>{setParams(prev=>({...prev,...values}));setResponse('idle');setResetKey(x=>x+1)};
 const controls=current.controls.filter(c=>scene==='double'?(c.key==='height'?[1,3,4].includes(modelIndex):c.key==='amplitude'?modelIndex===0:true):scene==='ode'?(c.key!=='capacity'||params.odeModel===1):scene==='atlas'?(focus==='lissajous'?['freqA','freqB','phase'].includes(c.key):focus==='lorenz'?c.key==='lorenzSpeed':['gielisSymmetry','gielisExponent'].includes(c.key)):true);
 const reset=()=>{setParams(prev=>{const next={...prev};for(const c of current.controls)next[c.key]=defaults[c.key];if(scene==='functions')next.family=0;return next});setResponse('idle');setResetKey(x=>x+1)};
 const check=()=>{const ok=info.passed;setResponse(ok?'correct':'retry');if(ok)setDone(prev=>prev.includes(scene)?prev:[...prev,scene])};
 const next=()=>select(lessons[(lessons.findIndex(l=>l.id===scene)+1)%lessons.length].id);
 return <div className="app" style={style}>
  <div className="orb orb-one"/><div className="orb orb-two"/>
  <aside className={'sidebar '+(mobileMenu?'open':'')}>
   <div className="brand"><span className="brand-symbol">∞</span><span><b>mathscape.</b><small>ACADEMY / LAB</small></span></div>
   <div className="side-head"><span className="overline">DE LOS NÚMEROS AL PLANETA</span><p>Dos rutas, una misma pregunta: <strong>¿cómo conocemos el mundo?</strong></p></div>
   <div className="route-picker" role="group" aria-label="Rutas educativas"><button className={!['projection','raster','sensors'].includes(scene)?'active':''} onClick={()=>select('functions')}>∑ Matemática</button><button className={['projection','raster','sensors'].includes(scene)?'active':''} onClick={()=>select('projection')}>◎ Geoespacial</button></div>
   <nav className="chapters" aria-label="Exploraciones matemáticas y geoespaciales">{groups.map(group=><div className="group" key={group.label}><div className="group-name">{group.label}</div>{group.ids.map(id=>{
    const item=lessons.find(l=>l.id===id as SceneId)!;
    return <button key={id} className={'chapter '+(id===scene?'current':'')} onClick={()=>select(item.id)} aria-current={scene===id?'page':undefined}><span className="chapter-index">{item.no}</span><span className="chapter-title">{id==='atlas'?'El universo generativo':id==='functions'?'Funciones':id==='limits'?'Límites y continuidad':id==='derivative'?'Derivadas':id==='integral'?'Integrales':id==='double'?'Integrales dobles':id==='matrix'?'Matrices':id==='ode'?'Ecuaciones diferenciales' :id==='terrain'?'Terreno y relieve':id==='projection'?'Tierra y proyecciones':id==='raster'?'Ráster y vector':id==='sensors'?'Bandas y sensores':'Gradientes'}</span><span className="completed">{done.includes(item.id)?'✓':id===scene?'◉':'·'}</span></button>
   })}</div>)}</nav>
   <div className="side-bottom"><span className="tiny-dot"/><div><strong>Una idea por experimento.</strong><small>Matemática real · Arte vivo.</small></div></div>
  </aside>
  <div className="right-area">
   <header className="header">
    <div className="breadcrumb"><button className="menu-toggle" onClick={()=>setMobileMenu(p=>!p)} aria-label="Abrir navegación">☰</button><span>MATHSCAPE</span><span className="slash">/</span><span>INTERACTIVE STUDIO</span><span className="slash">/</span><strong>{current.no}</strong></div>
    <div className="header-right"><span className="workspace-status"><span className="pulse"/> ADAPTIVE RENDER</span><span className="progress">{String(completeCount).padStart(2,'0')} <span>/ {String(lessons.length).padStart(2,'0')} EXP.</span></span></div>
   </header>
   <div className="main-content">
    <section className="intro"><div className="overline"><span className="diamond">✧</span> {['projection','raster','sensors'].includes(scene)?'GEOSPATIAL EXPLORATION':'MATHEMATICAL EXPLORATION'} / {current.section}</div><h1>{scene==='atlas'?<>La forma es <em>conocimiento.</em></>:<>{current.title.split(' ').slice(0,-1).join(' ')} <em>{current.title.split(' ').slice(-1)}</em></>}</h1><p>{current.description}</p></section>
    <div className="workspace">
     <section className="visual-column"><div className="stage-frame"><div className="stage-corner" aria-hidden="true">EXPERIMENT / {current.no}</div>
      <div className="stage-top"><div className="stage-label"><span className="stage-icon">✳</span><div><span>LIVE MATHEMATICS</span><strong>{sceneName[scene]}</strong></div></div><div className="stage-tools">{scene==='atlas'&&<button onClick={()=>setPlaying(x=>!x)} title={playing?'Pausar':'Reanudar'} aria-label={playing?'Pausar animación':'Reanudar animación'}>{playing?'Ⅱ':'▶'}</button>}<button onClick={reset} title="Restablecer" aria-label="Restablecer parámetros">↺</button></div></div>
      {scene==='terrain'&&Math.round(params.terrainView||0)===2?<Suspense fallback={<div className='terrain-loading'>Preparando relieve 3D…</div>}><TerrainThree params={params} onFallback={()=>update('terrainView',0)}/></Suspense>:<Stage scene={scene} params={params} accent={current.accent} playing={playing} focus={focus} resetKey={resetKey}/>}
      {scene==='terrain'&&<div className='terrain-view-switch' role='group' aria-label='Representación del terreno'>{[['0','Relieve 2.5D'],['1','Curvas de nivel'],['2','Terreno 3D']] .map(([mode,label])=><button key={mode} type='button' className={Math.round(params.terrainView||0)===Number(mode)?'active':''} aria-pressed={Math.round(params.terrainView||0)===Number(mode)} onClick={()=>update('terrainView',Number(mode))}>{label}</button>)}</div>}
      {scene==='atlas'&&<div className="focus-switch" aria-label="Geometría generativa">{([['lissajous','Lissajous'],['lorenz','Lorenz'],['gielis','Gielis']] as [AtlasFocus,string][]).map(([key,label],i)=><button key={key} onClick={()=>{setFocus(key);update('atlasModel',i)}} className={focus===key?'active':''} aria-pressed={focus===key}>{label}</button>)}</div>}
      <div className="stage-footer"><span className="scene-tag">● {scene==='atlas'?'GENERATIVE SYSTEMS':scene==='double'?'DOUBLE INTEGRAL / SURFACE':scene==='gradient'?'PARTIAL DERIVATIVES':scene==='terrain'?'TERRAIN / RASTER & CALCULUS':scene==='projection'?'GEO / MAP PROJECTIONS':scene==='raster'?'GEO / RASTER × VECTOR':scene==='sensors'?'GEO / SPECTRAL BANDS':scene.toUpperCase()}</span><span>{scene==='terrain'&&params.terrainView===1?'LEÉ LAS CURVAS · COMPARÁ CON EL PERFIL':scene==='terrain'&&params.terrainView===2?'MOUSE ↔ ÓRBITA / ZOOM':(['atlas','double','gradient','terrain'].includes(scene)?'MOUSE DRAG ↔ ROTATE':'CHANGE PARAMETERS ↗ OBSERVE')}</span></div>
     </div>
     <div className="metrics">{info.metrics.map((m,i)=><div className="stat" key={m.label}><span className="stat-name">{m.label}</span><strong>{m.value}</strong><span className="stat-rule" style={{opacity:i===0?1:.45}}/></div>)}</div>
     <div className="context-strip"><span className="context-icon">↗</span><p>{info.observation}</p></div>
     </section>
     <section className="inspector" aria-label="Panel de experimentación"><div className="inspector-inner">
      <div className="inspector-top"><div><span className="overline">PARAMETER LAB</span><h2>Experimentá.</h2></div><span className="step-num">{current.no}<span>/{lessons.length}</span></span></div>
      {sceneExamples.length>0&&<div className="example-lab"><span className="field-label">EJEMPLOS PARA EXPERIMENTAR</span><div className="example-options">{sceneExamples.map(ex=><button key={ex.label} type="button" className={Object.entries(ex.params).every(([k,v])=>params[k]===v)?'active':''} title={ex.subtitle} onClick={()=>applyExample(ex.params)}><b>{ex.label}</b><small>{ex.subtitle}</small></button>)}</div></div>}<div className="formula-card"><span className="field-label">FÓRMULA · DOMINIO · RESULTADO</span><div className="formula-text" aria-live="polite">{info.formula}</div></div>
      {scene==='functions'&&<div className="family-lab"><span className="field-label">FAMILIA / TIPO DE FUNCIÓN</span><div className="family-options" role="group" aria-label="Tipo de función">{functionFamilies.map((f,i)=><button key={f.label} type="button" className={i===family?'active':''} aria-pressed={i===family} onClick={()=>update('family',i)}>{f.label}</button>)}</div></div>}
      <div className="control-head"><span className="field-label">VARIABLES DE CONTROL</span><button onClick={reset}>RESTABLECER ↺</button></div>
      <div className="sliders">{controls.map(ctl=><label className="slider" key={ctl.key}><div><span>{ctl.label}</span><output>{number(params[ctl.key])}{ctl.unit||''}</output></div><input type="range" min={ctl.min} max={ctl.max} step={ctl.step} value={params[ctl.key]} onChange={e=>update(ctl.key,Number(e.currentTarget.value))} /></label>)}</div>
      <div className="explain"><span className="explain-icon">✦</span><div><span className="field-label">LO QUE ESTÁ OCURRIENDO</span><p>{info.explanation}</p></div></div>
      <div className="task"><div className="task-title"><span>MICRODESAFÍO</span><span className="task-star">✳</span></div><h3>¿Podés conseguirlo?</h3><p>{scene==='functions'?familyMeta.challenge:scene==='limits'&&params.limitModel===2?'Acercá h a 0,05 y comprobá por qué el límite bilateral no existe.':scene==='atlas'&&focus==='lorenz'?'Reducí la velocidad del atractor a menos de 0,5.':scene==='atlas'&&focus==='gielis'?'Conseguí una simetría con 8 lóbulos o más.':current.challenge}</p><div className="task-actions"><button className="check" onClick={check}>Comprobar <span>↗</span></button><button className="hint" onClick={()=>setResponse('hint')}>Pista</button></div><div className={'answer '+response} aria-live="polite">{response==='correct'?'✓ Bien. Lo conseguiste.':response==='retry'?'Todavía no. Probá modificar las variables.':response==='hint'?(scene==='functions'?familyMeta.hint:scene==='double'?'Cada figura tiene un dominio propio. Afiná la resolución y observá el error relativo.':current.hint):'Primero experimentá. Después comprobá.'}</div></div>
      <button className="next" onClick={next}>SIGUIENTE EXPLORACIÓN <span>→</span></button>
     </div></section>
    </div>
    <footer className="footer"><span>© MATHSCAPE ACADEMY · EXPERIMENTAL EDUCATION</span><span>REACT / TYPESCRIPT / CANVAS 2D + THREE.JS BAJO DEMANDA</span></footer>
   </div>
  </div>
 </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
