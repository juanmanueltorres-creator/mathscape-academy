import test from 'node:test';
import assert from 'node:assert/strict';
import {neuron,sigmoid,descentStep,regressionLoss,regressionGradient,attention} from '../src/ai-math.ts';

const close=(a,b,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<tolerance,`${a} no coincide con ${b}`);
test('sigmoide y neurona: pesos, sesgo y extremos',()=>{
 close(sigmoid(0),.5);
 close(neuron([1,1],[2,-2],0).probability,.5);
 close(neuron([1,0],[1,0],0).z,1);
 assert.ok(sigmoid(-1000)<1e-100);
 assert.ok(sigmoid(1000)>.9999);
 assert.throws(()=>neuron([Infinity,0],[1,1],0),RangeError);
});
test('descenso de gradiente converge para tasa acotada',()=>{
 let w=-1;
 for(let i=0;i<20;i++){
  const step=descentStep(w,.7);
  assert.ok(step.after<=step.before);
  w=step.next;
 }
 assert.ok(regressionLoss(w)<.00002);
 close(regressionGradient(2),0);
 assert.throws(()=>descentStep(1,0),RangeError);
});
test('atención softmax normaliza pesos y produce media ponderada',()=>{
 const a=attention(0,1);
 close(a.weights.reduce((s,x)=>s+x,0),1);
 assert.ok(a.weights.every(x=>x>0&&x<1));
 assert.ok(a.weights[0]>a.weights[1]);
 const cold=attention(0,.4);
 assert.ok(cold.weights[0]>a.weights[0]);
 close(a.output[0],a.weights[0]+a.weights[2]*.35);
 assert.throws(()=>attention(0,0),RangeError);
});
