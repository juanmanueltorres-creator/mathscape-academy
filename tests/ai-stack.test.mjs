import test from 'node:test';
import assert from 'node:assert/strict';
import {softmax,chooseToken,toyPrediction,toyEncode,agentTrace} from '../src/ai-stack.ts';

const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<t,`Se esperaba ${b} pero llegó ${a}`);

test('softmax es estable y normaliza sin overflow en logits grandes',()=>{
 const probs=softmax([1000,1001,999]);
 near(probs.reduce((sum,n)=>sum+n,0),1);
 assert.ok(probs.every(x=>x>0&&x<1));
 assert.equal(probs.indexOf(Math.max(...probs)),1);
 assert.deepEqual(softmax([2,2]),[.5,.5]);
 assert.throws(()=>softmax([],1),RangeError);
 assert.throws(()=>softmax([0,1],0),RangeError);
 assert.throws(()=>softmax([0,Infinity],1),RangeError);
});
test('temperatura baja concentra y temperatura alta suaviza',()=>{
 const cold=softmax([2,1,-1],.4),warm=softmax([2,1,-1],2);
 assert.ok(cold[0]>warm[0]);
 near(warm.reduce((a,b)=>a+b,0),1);
});
test('selección de token con muestra controlada tiene límites válidos',()=>{
 assert.equal(chooseToken([.2,.3,.5],0),0);
 assert.equal(chooseToken([.2,.3,.5],.2),1);
 assert.equal(chooseToken([.2,.3,.5],.49999),1);
 assert.equal(chooseToken([.2,.3,.5],.5),2);
 assert.equal(chooseToken([.2,.3,.5],1),2);
 assert.throws(()=>chooseToken([.3,.3],.1),RangeError);
 assert.throws(()=>chooseToken([.5,.5],-1),RangeError);
});
test('la misma muestra reproduce salida y contexto',()=>{
 const a=toyPrediction('terrain',1,.3),b=toyPrediction('terrain',1,.3);
 assert.deepEqual(a,b);
 assert.equal(a.prompt,'La pendiente del terreno depende del');
 assert.equal(a.output,a.candidates[a.chosen]);
 near(a.probabilities.reduce((sum,v)=>sum+v,0),1);
});
test('codificador ilustrativo es estable y crea vectores unitarios',()=>{
 const tokens=toyEncode('¿Cómo funciona la IA?');
 assert.equal(tokens.length,4);
 assert.deepEqual(tokens,toyEncode('¿Cómo funciona la IA?'));
 for(const t of tokens)near(Math.hypot(...t.vector),1);
 assert.throws(()=>toyEncode(Array(18).fill('token').join(' ')),RangeError);
});
test('agente no da resultado aprobado si falla la herramienta',()=>{
 const stopped=agentTrace('geo',false,true);
 assert.equal(stopped[2].status,'blocked');
 assert.equal(stopped[4].status,'blocked');
 const failedTest=agentTrace('backend',true,false);
 assert.equal(failedTest[3].status,'pending');
 assert.equal(failedTest[4].status,'blocked');
 const passed=agentTrace('backend',true,true);
 assert.ok(passed.every(step=>step.status==='ok'));
});
