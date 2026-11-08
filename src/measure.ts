import {functionFamilies,type SceneId} from './content';
import {terrainReport,terrainEquation} from './terrain';
import {calculateGeospatial} from './geo-measure';
import {determinant,norm2,familyAnchor,familyValue,familyDerivative,derivativeExampleSlope,secantExample,exactIntegralExample,leftRiemannExample,exactSolidVolume,midpointSolidVolume,limitLeftRight,limitCenter,solveEulerModel,odeModelExact,gradientExample} from './math';
export type Metric={label:string;value:string;detail?:string};
export type Result={metrics:Metric[];explanation:string;passed:boolean;observation:string;formula:string};
const num=(v:number,digits=3)=>Number(v.toFixed(digits)).toLocaleString('es-AR');
const met=(label:string,v:number,detail?:string):Metric=>({label,value:num(v),detail});
export function calculate(scene:SceneId,p:Record<string,number>):Result{
 if(scene==='projection'||scene==='raster'||scene==='sensors')return calculateGeospatial(scene,p);
 if(scene==='atlas'){
  const m=Math.round(p.atlasModel||0),formula=[`x=sen(${p.freqA}t + ${num(p.phase,2)}); y=sen(${p.freqB}t)`,`x′=10(y−x), y′=x(28−z)−y, z′=xy−8z/3`,`r(θ)=[|cos(${p.gielisSymmetry}θ/4)|ⁿ²+|sen(${p.gielisSymmetry}θ/4)|ⁿ³]^(−1/${num(p.gielisExponent,2)})`][m]||'';
  return {metrics:[met('Frecuencia A',p.freqA),met('Frecuencia B',p.freqB),{label:'Sistema',value:['Lissajous','Lorenz','Gielis'][m]}],explanation:['Las dos frecuencias construyen una órbita periódica. Cambiá a/b y el desfase para explorar los patrones.','El atractor de Lorenz es un sistema caótico determinista con parámetros clásicos.','La superfórmula combina simetrías y exponentes; no es una simulación física.'][m],passed:m===0?p.freqA===3&&p.freqB===2:m===1?p.lorenzSpeed<.5:p.gielisSymmetry>=8,observation:'Tres sistemas separados para evitar sobrecarga gráfica. Cada experiencia conserva su propia ecuación.',formula};
 }
 if(scene==='functions'){
  const family=Math.max(0,Math.min(4,Math.round(p.family||0)));
  const meta=functionFamilies[family],anchor=familyAnchor(family,p.fb);
  const val=familyValue(family,anchor,p.fa,p.fb,p.fc);
  const deriv=familyDerivative(family,anchor,p.fa,p.fb);
  const passed=[Math.abs(p.fa)<.01&&p.fb>.1,Math.abs(p.fa)>=1&&p.fb>=1,p.fa>.5&&p.fb>.1,p.fa>.1&&p.fb<0,Math.abs(p.fa)>=1][family];
  return {metrics:[{label:'Familia',value:meta.label},met(`f(${num(anchor,1)})`,val),met(`f′(${num(anchor,1)})`,deriv)],explanation:meta.insight,passed,observation:family>=3?`Dominio: x ${family===3?'>':'≠'} ${num(p.fb,2)}. La asíntota aparece en x=${num(p.fb,2)}.`:`La pendiente indicada corresponde a x=${num(anchor,1)}.`,formula:meta.formula(p.fa,p.fb,p.fc)};
 }
 if(scene==='limits'){
  const m=Math.round(p.limitModel||0),[left,right]=limitLeftRight(m,p.lh),target=m===0?1:m===1?2:NaN;
  const err=m===2?Math.abs(left-right):Math.max(Math.abs(left-target),Math.abs(right-target));
  const center=limitCenter(m);
  return {metrics:[met('Por izquierda',left),met('Por derecha',right),m===2?met('Diferencia lateral',err):met('Error respecto al límite',err)],explanation:m===0?'Aunque sen(x)/x no está definida en 0, los dos lados se aproximan a 1.':m===1?'La expresión (x²−1)/(x−1) tiene un hueco en x=1, pero coincide con x+1 fuera de ese punto.':'Una discontinuidad de salto tiene límites laterales distintos; el límite bilateral no existe.',passed:m===2?p.lh<.1:err<.001,observation:m===2?'Límite por izquierda = −1; por derecha = +1. No existe el límite bilateral.':`Al aproximarte a x=${center}, los dos límites laterales tienden a ${target}.`,formula:[`limₓ→₀ sen(x)/x = 1`,`limₓ→₁ (x²−1)/(x−1) = 2`,`limₓ→₀⁻ f(x)=−1 ; limₓ→₀⁺ f(x)=1`][m]};
 }
 if(scene==='derivative'){
  const m=Math.round(p.derivativeModel||0),sec=secantExample(m,p.x0,p.h),der=derivativeExampleSlope(m,p.x0),err=Math.abs(sec-der);
  const formula=[`f(x)=x² ; f′(x)=2x`,`f(x)=sen(x) ; f′(x)=cos(x)`,`f(x)=eˣ ; f′(x)=eˣ`][m];
  return {metrics:[met('Pendiente secante',sec),met('Pendiente tangente',der),met('Error',err)],explanation:'La pendiente secante [f(x+h)−f(x)]/h aproxima a la derivada. Compará la recta azul con la tangente violeta.',passed:err<.05,observation:`En x₀=${num(p.x0,2)} la derivada exacta vale ${num(der)}.`,formula:`${formula}\n[f(x₀+h)−f(x₀)] / h`};
 }
 if(scene==='integral'){
  const m=Math.round(p.integralModel||0),approx=leftRiemannExample(m,0,p.upper,p.n),exact=exactIntegralExample(m,0,p.upper),err=Math.abs(approx-exact);
  const model=[`x²/4 + 1/2`,`1 + sen(x)`,`1 + x/2`][m];
  return {metrics:[met('Suma izquierda',approx),met('Integral exacta',exact),met('Error absoluto',err)],explanation:'Cada rectángulo toma la altura del extremo izquierdo. La integral definida mide acumulación (área aquí porque f(x)≥0).',passed:err<.05,observation:`${p.n} rectángulos en [0, ${num(p.upper,2)}] con f(x)=${model}.`,formula:`∫₀^${num(p.upper,1)} (${model}) dx = ${num(exact,4)}`};
 }
 if(scene==='double'){
  const m=Math.round(p.doubleModel||0),r=p.bound,h=p.height,n=Math.round(p.resolution);
  const approx=midpointSolidVolume(m,r,h,p.amplitude,n),exact=exactSolidVolume(m,r,h,p.amplitude),err=Math.abs(approx-exact),relative=exact>0?100*err/exact:0;
  const formulas=[`D=[−b,b]², b=${num(r,2)}\nz=1+${num(p.amplitude,2)}(x²+y²)\nV=∬ᴰ z dA = 4b²+(8/3)ab⁴`, `D: x²+y²≤R²; R=${num(r,2)}\nz=H=${num(h,2)}\nV=∬ᴰ H dA = πR²H`, `D: x²+y²≤R²; R=${num(r,2)}\nz=√(R²−x²−y²)\nV=∬ᴰ z dA = 2πR³/3`, `D: x²+y²≤R²; R=${num(r,2)}\nz=H(1−(x²+y²)/R²)\nV=∬ᴰ z dA = πR²H/2`, `D: x²+y²≤R²; R=${num(r,2)}\nz=H(1−√(x²+y²)/R)\nV=∬ᴰ z dA = πR²H/3`][m];
  const name=['Cuadrática sobre cuadrado','Cilindro','Hemisferio superior','Paraboloide sólido','Cono circular','Esfera completa'][m];
  return {metrics:[met('Volumen aproximado',approx),met('Volumen exacto',exact),met('Error relativo %',relative),met('Celdas',m===0?n*n:4*n*n)],explanation:m===5?'La esfera completa se calcula integrando el espesor vertical z_superior−z_inferior = 2√(R²−x²−y²) sobre el disco.':m===2?'Un hemisferio es la mitad superior de una esfera. El volumen de la esfera completa es 4πR³/3; aquí se integra únicamente la mitad de arriba.':m===0?'En el cuadrado usamos una suma bidimensional en coordenadas cartesianas; el volumen se mide bajo z(x,y).':'Para el disco usamos coordenadas polares: dA=r dr dθ. Cada anillo aporta volumen sobre su porción de superficie.',passed:relative<1,observation:`${name}. Suma de puntos medios (${m===0?'cartesiana':'polar'}) con resolución n=${n}.`,formula:formulas};
 }
 if(scene==='matrix'){
  const det=determinant([p.ma,p.mb,p.mc,p.md]);
  return{metrics:[met('Determinante',det),met('Factor de área',Math.abs(det)),met('Orientación',Math.sign(det))],explanation:'El determinante indica el factor de cambio de área orientada. Cuando vale cero la transformación deja de ser invertible.',passed:Math.abs(det)<.001,observation:det<0?'La transformación invierte la orientación.':det===0?'La transformación aplasta el plano.':'La orientación se conserva.',formula:`[ ${num(p.ma,2)}   ${num(p.mb,2)} ]    [ ${num(p.mc,2)}   ${num(p.md,2)} ]`};
 }
 if(scene==='ode'){
  const m=Math.round(p.odeModel||0),points=solveEulerModel(m,p.k,p.y0,4,p.dt,p.capacity),approx=points.at(-1)!.y,exact=odeModelExact(m,p.k,p.y0,4,p.capacity),err=Math.abs(approx-exact);
  return {metrics:[met('Euler · t=4',approx),met('Exacta · t=4',exact),met('Error',err),met('Pasos',points.length-1)],explanation:m===0?'En el modelo exponencial la tasa es proporcional al estado y.':'El modelo logístico agrega capacidad de carga K, que frena el crecimiento cuando y se acerca a K.',passed:err<.035,observation:`Modelo ${m===0?'exponencial':'logístico'}, paso Δt=${num(p.dt,2)}. Reducir el paso reduce normalmente el error.`,formula:m===0?`y′=${num(p.k,2)}y ; y(t)=y₀e^(kt)`:`y′=${num(p.k,2)}y(1−y/${num(p.capacity,2)})\ny(t)=K/[1+(K/y₀−1)e^(−kt)]`};
 }
 if(scene==='terrain'){
  const t=terrainReport(p);
  const viewMode=Math.round(p.terrainView||0);
  const representations=[
   'La perspectiva 2.5D muestra el mismo z(x,y) del perfil. Girar la cámara cambia el dibujo, no las elevaciones ni los volúmenes.',
   'Una curva de nivel conecta posiciones donde z(x,y)=c. El intervalo vertical es una diferencia de altura en metros; curvas juntas indican mayor pendiente local. Se interpolan a partir de una grilla, no se miden en campo.',
   'Three.js transforma en triángulos las mismas elevaciones z(x,y). El plano semitransparente representa la cota z₀: la parte superior y la inferior se integran por separado. La rotación no cambia el volumen calculado.'
  ];
  const shapes=['Lomas y quebradas','Valle con cauce curvo','Ladera con ondulaciones'];
  return {
   metrics:[met('Cota del punto (m)',t.z),met('Pendiente (%)',t.slopePercent),met('Corte sobre z₀ (m³)',t.coarse.above),met('Relleno bajo z₀ (m³)',t.coarse.below),met('Dif. por resolución (%)',t.samplingDifferencePercent)],
   explanation:representations[Math.max(0,Math.min(2,viewMode))]+' Es un modelo sintético; los volúmenes no sustituyen un levantamiento ni un cálculo de movimiento de suelos.',
   passed:t.samplingDifferencePercent<1,
   observation:`${shapes[t.model]} · ${t.coarse.cells} celdas de ${num(t.coarse.cellSize,1)} m · comparación con grilla de 120×120. Diferencia de muestreo ≠ incertidumbre del DEM. SIN DATOS REALES.`,
   formula:`${terrainEquation(t.model,t.irregularity)}\n${viewMode===1?`Curva de nivel: z(x,y)=c; Δc=${num(p.contourStep||50,0)} m\n`:''}∇z≈((z(x+Δ,y)−z(x−Δ,y))/(2Δ), (z(x,y+Δ)−z(x,y−Δ))/(2Δ))\nθ=arctan(|∇z|) = ${num(t.slopeDegrees,2)}°\nV₊(z₀)=∬ᴰ max(z−z₀,0)dA ≈ Σᵢⱼ max(zᵢⱼ−${num(t.datum,0)},0)·${num(t.coarse.cellSize**2,0)} m²`
  };
 }
 const m=Math.round(p.gradientModel||0),grad=gradientExample(m,p.ga,p.gb,p.gx,p.gy),mag=norm2(grad);
 const formulas=[`z=${num(p.ga,2)}x²+${num(p.gb,2)}y²\n∇z=(2ax, 2by)`,`z=${num(p.ga,2)}x²−${num(p.gb,2)}y²\n∇z=(2ax, −2by)`,`z=${num(p.ga,2)}e^(−${num(p.gb,2)}(x²+y²))\n∇z=−2b(x,y)z`];
 return {metrics:[met('∂z/∂x',grad[0]),met('∂z/∂y',grad[1]),met('|∇z|',mag)],explanation:m===0?'El gradiente apunta alejándose del mínimo del cuenco.':m===1?'Una silla de montar sube en x y baja en y; el gradiente combina esos cambios.':'La campana gaussiana alcanza su máximo en el centro; fuera del centro, el gradiente señala la dirección de subida hacia ese máximo.',passed:mag<.1,observation:`Punto (${num(p.gx,2)}, ${num(p.gy,2)}), campo gradiente calculado analíticamente.`,formula:formulas[m]};
}
