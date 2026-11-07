import {functionFamilies,type SceneId} from './content';
import {derivativeQuadratic,secantQuadratic,leftRiemann,exactIntegral,exactDoubleIntegral,midpointDoubleIntegral,determinant,odeExact,solveEuler,norm2,surfaceGradient,familyAnchor,familyValue,familyDerivative} from './math';
export type Metric={label:string;value:string;detail?:string};
export type Result={metrics:Metric[];explanation:string;passed:boolean;observation:string;formula:string};
const num=(v:number,digits=3)=>Number(v.toFixed(digits)).toLocaleString('es-AR');
const met=(label:string,v:number,detail?:string):Metric=>({label,value:num(v),detail});
export function calculate(scene:SceneId,p:Record<string,number>):Result{
 if(scene==='atlas')return {metrics:[met('Frecuencia A',p.freqA),met('Frecuencia B',p.freqB),met('Desfase',p.phase)],explanation:'La superposición de tres sistemas matemáticos produce una composición compleja, aunque cada sistema tiene reglas propias. El atractor de Lorenz se muestra con parámetros clásicos fijos.',passed:p.freqA===3&&p.freqB===2,observation:`Relación ${p.freqA}:${p.freqB}. Dos frecuencias enteras producen una curva cerrada de Lissajous.`,formula:`x = sen(${p.freqA}t + ${num(p.phase,2)})  ·  y = sen(${p.freqB}t)`};
 if(scene==='functions'){
  const family=Math.max(0,Math.min(4,Math.round(p.family||0)));
  const meta=functionFamilies[family],anchor=familyAnchor(family,p.fb);
  const val=familyValue(family,anchor,p.fa,p.fb,p.fc);
  const deriv=familyDerivative(family,anchor,p.fa,p.fb);
  const passed=[Math.abs(p.fa)<.01&&p.fb>.1,Math.abs(p.fa)>=1&&p.fb>=1,p.fa>.5&&p.fb>.1,p.fa>.1&&p.fb<0,Math.abs(p.fa)>=1][family];
  return {metrics:[{label:'Familia',value:meta.label},met(`f(${num(anchor,1)})`,val),met(`f′(${num(anchor,1)})`,deriv)],explanation:meta.insight,passed,observation:family>=3?`Dominio: x ${family===3?'>':'≠'} ${num(p.fb,2)}. La asíntota aparece en x=${num(p.fb,2)}.`:`La pendiente indicada corresponde a x=${num(anchor,1)}.`,formula:meta.formula(p.fa,p.fb,p.fc)};
 }
 if(scene==='limits'){
  const v=Math.sin(p.lh)/p.lh,err=Math.abs(1-v);
  return {metrics:[met('f(+h)',v),met('f(−h)',v),met('Distancia a 1',err)],explanation:'El valor de sen(x)/x no está definido para x=0. Sin embargo, sus valores se acercan a 1 desde los dos lados.',passed:err<.001,observation:`Para h = ${num(p.lh,2)}, la función se aproxima a ${num(v,5)}.`,formula:'limₓ→₀ (sen x)/x = 1'};
 }
 if(scene==='derivative'){
  const sec=secantQuadratic(p.x0,p.h),der=derivativeQuadratic(p.x0),err=Math.abs(sec-der);
  return{metrics:[met('Secante',sec),met('Tangente',der),met('Diferencia',err)],explanation:'La derivada es la pendiente de la tangente. Para f(x)=x², la secante entre x₀ y x₀+h tiene pendiente 2x₀+h.',passed:err<.1,observation:`La pendiente instantánea en x₀=${num(p.x0,1)} es ${num(der)}.`,formula:'f(x)=x²  ·  f′(x)=2x'};
 }
 if(scene==='integral'){
  const approx=leftRiemann(0,p.upper,p.n),exact=exactIntegral(0,p.upper),err=Math.abs(approx-exact);
  return {metrics:[met('Suma izquierda',approx),met('Integral exacta',exact),met('Error',err)],explanation:'Una integral definida acumula cambios a lo largo de un intervalo. Aquí los rectángulos utilizan extremos izquierdos y subestiman la función creciente.',passed:err<.05,observation:`n=${p.n} rectángulos sobre [0,${num(p.upper,2)}].`,formula:`∫₀^${num(p.upper,1)} (x²/4 + 1/2) dx`};
 }
 if(scene==='double'){
  const approx=midpointDoubleIntegral(p.amplitude,p.bound,p.resolution),exact=exactDoubleIntegral(p.amplitude,p.bound),err=Math.abs(approx-exact);
  return{metrics:[met('Volumen aprox.',approx),met('Valor exacto',exact),met('Error',err),met('Prismas',p.resolution*p.resolution)],explanation:'Una integral doble acumula valores sobre una región bidimensional. Cada celda tiene área ΔxΔy; el valor de la superficie en su centro determina su contribución al volumen.',passed:err<.015,observation:`R=[−${num(p.bound,1)},${num(p.bound,1)}]². Método: punto medio en ${p.resolution}×${p.resolution} celdas.`,formula:`∬ᴿ [1 + ${num(p.amplitude,2)}(x²+y²)] dA`};
 }
 if(scene==='matrix'){
  const det=determinant([p.ma,p.mb,p.mc,p.md]);
  return{metrics:[met('Determinante',det),met('Factor de área',Math.abs(det)),met('Orientación',Math.sign(det))],explanation:'El determinante indica el factor de cambio de área orientada. Cuando vale cero la transformación deja de ser invertible.',passed:Math.abs(det)<.001,observation:det<0?'La transformación invierte la orientación.':det===0?'La transformación aplasta el plano.':'La orientación se conserva.',formula:`[ ${num(p.ma,2)}   ${num(p.mb,2)} ]    [ ${num(p.mc,2)}   ${num(p.md,2)} ]`};
 }
 if(scene==='ode'){
  const points=solveEuler(p.k,p.y0,4,p.dt),approx=points[points.length-1].y,exact=odeExact(p.k,p.y0,4),err=Math.abs(approx-exact);
  return{metrics:[met('Euler · t=4',approx),met('Exacto · t=4',exact),met('Error final',err),met('Pasos',points.length-1)],explanation:'Euler utiliza y(t+Δt)≈y(t)+Δt·k·y(t), una aproximación local. En esta ecuación la solución exacta permite observar la acumulación del error.',passed:err<.025,observation:p.k<0?'El sistema decae hacia cero.':p.k>0?'El sistema crece exponencialmente.':'El estado permanece constante.',formula:`dy/dt = ${num(p.k,2)}y  ·  y(0)=${num(p.y0,2)}`};
 }
 const grad=surfaceGradient(p.ga,p.gb,p.gx,p.gy),mag=norm2(grad);
 return{metrics:[met('∂f/∂x',grad[0]),met('∂f/∂y',grad[1]),met('|∇f|',mag)],explanation:'Las derivadas parciales describen cambios en direcciones independientes. Juntas forman el gradiente, que apunta hacia el aumento más rápido de la superficie.',passed:mag<.1,observation:`Punto (${num(p.gx,2)}, ${num(p.gy,2)}). El gradiente se anula en el mínimo de este paraboloide.`,formula:`∇f = (${num(2*p.ga,2)}x, ${num(2*p.gb,2)}y)`};
}
