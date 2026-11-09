/** Modelos diminutos, deterministas y educativos. No emulan el entrenamiento de un LLM. */
export type Vec2=readonly [number,number];
export type NeuronResult={z:number;probability:number};
export const sigmoid=(z:number)=>z>=0?1/(1+Math.exp(-z)):Math.exp(z)/(1+Math.exp(z));
export function neuron(x:Vec2,w:Vec2,b:number):NeuronResult{
 const z=x[0]*w[0]+x[1]*w[1]+b;
 if(!Number.isFinite(z))throw new RangeError('Entrada no finita');
 return {z,probability:sigmoid(z)};
}
/** Regresión lineal y=Mx, tres muestras sintéticas con pendiente verdadera 2. */
const xs=[0,.5,1] as const;
export function regressionLoss(w:number){
 if(!Number.isFinite(w))throw new RangeError('Peso no finito');
 return xs.reduce((s,x)=>s+(w*x-2*x)**2,0)/xs.length;
}
export function regressionGradient(w:number){
 if(!Number.isFinite(w))throw new RangeError('Peso no finito');
 return xs.reduce((s,x)=>s+2*(w*x-2*x)*x,0)/xs.length;
}
export function descentStep(w:number,rate:number){
 if(!Number.isFinite(rate)||rate<=0)throw new RangeError('Tasa inválida');
 const gradient=regressionGradient(w);
 const next=w-rate*gradient;
 return {w,next,gradient,before:regressionLoss(w),after:regressionLoss(next)};
}
export const keys:Vec2[]=[[1,0],[0,1],[-.65,.75]];
export const values:Vec2[]=[[1,0],[0,1],[.35,.65]];
export function attention(angle:number,temperature:number){
 if(!Number.isFinite(angle)||!Number.isFinite(temperature)||temperature<=0)throw new RangeError('Parámetros inválidos');
 const theta=angle*Math.PI/180,q:Vec2=[Math.cos(theta),Math.sin(theta)];
 const logits=keys.map(k=>(q[0]*k[0]+q[1]*k[1])/(Math.sqrt(2)*temperature));
 const max=Math.max(...logits);
 const exponentials=logits.map(v=>Math.exp(v-max));
 const sum=exponentials.reduce((a,b)=>a+b,0);
 const weights=exponentials.map(x=>x/sum);
 const output:Vec2=[weights.reduce((s,w,i)=>s+w*values[i][0],0),weights.reduce((s,w,i)=>s+w*values[i][1],0)];
 return {q,logits,weights,output};
}
