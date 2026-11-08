import test from 'node:test';
import assert from 'node:assert/strict';
import {PARTS,LAYERS,JOURNEYS,HARDWARE_QUIZ,getPart,journeyState,quizCorrect} from '../src/hardware.ts';

test('six components have distinct jobs, role and limitations',()=>{
 assert.deepEqual(PARTS.map(x=>x.id),['cpu','ram','ssd','nic','motherboard','gpu']);
 for(const x of PARTS){
  assert.ok(x.function.length>28&&x.example.length>24&&x.avoid.length>18);
  assert.match(x.accent,/^#[0-9a-f]{6}$/i);
 }
 assert.throws(()=>getPart('unsupported'),RangeError);
});
test('hardware is physical, OS manages, network connects machines',()=>{
 assert.deepEqual(LAYERS.map(x=>x.id),['hardware','os','network','services','experience']);
 assert.ok(LAYERS.find(x=>x.id==='network').summary.includes('DNS'));
 assert.ok(LAYERS.find(x=>x.id==='os').summary.includes('kernel'));
});
test('boot model starts in hardware and ends in local application',()=>{
 const steps=JOURNEYS.boot;
 assert.equal(steps.length,5);
 assert.equal(steps[0].layer,'hardware');
 assert.equal(steps[2].layer,'os');
 assert.equal(steps.at(-1).layer,'experience');
 assert.ok(steps.every(s=>s.machine==='local'));
});
test('web request crosses client and a separate remote machine',()=>{
 const steps=JOURNEYS.web;
 assert.equal(steps.length,7);
 assert.equal(steps[0].machine,'local');
 assert.equal(steps[4].machine,'remote');
 assert.equal(steps[4].layer,'services');
 assert.equal(steps.at(-1).machine,'local');
});
test('normal web request finishes only at final step',()=>{
 assert.equal(journeyState('web',0).completed,false);
 const result=journeyState('web',6);
 assert.equal(result.completed,true);
 assert.equal(result.blocked,false);
 assert.equal(result.headline,'Aparece la página');
});
test('offline fault halts at network interface rather than remote server',()=>{
 const before=journeyState('web',2,'offline');
 assert.equal(before.blocked,false);
 const at=journeyState('web',3,'offline');
 assert.equal(at.blocked,true);
 assert.equal(at.blockIndex,3);
 assert.equal(at.step.layer,'hardware');
 const after=journeyState('web',6,'offline');
 assert.equal(after.blocked,true);
 assert.equal(after.step.heading,at.step.heading);
 assert.equal(after.completed,false);
});
test('server unavailable permits network transmission then halts remotely',()=>{
 assert.equal(journeyState('web',3,'server').blocked,false);
 const remote=journeyState('web',4,'server');
 assert.equal(remote.blocked,true);
 assert.equal(remote.blockIndex,4);
 assert.equal(remote.machine,'remote');
 assert.equal(journeyState('web',6,'server').completed,false);
});
test('boot sequence does not inherit web-only failure scenarios',()=>{
 assert.equal(journeyState('boot',4,'offline').completed,true);
 assert.equal(journeyState('boot',4,'server').blocked,false);
});
test('journey indices are finite and clamped to valid steps',()=>{
 assert.equal(journeyState('boot',-100).stepIndex,0);
 assert.equal(journeyState('web',100).stepIndex,6);
 assert.throws(()=>journeyState('web',NaN),RangeError);
});
test('quiz checks CPU RAM SSD explicitly and does not reward incorrect guesses',()=>{
 assert.equal(HARDWARE_QUIZ.length,3);
 const answers=['cpu','ram','ssd'];
 for(let i=0;i<answers.length;i++){
  assert.equal(quizCorrect(i,answers[i]),true);
  assert.equal(quizCorrect(i,answers[(i+1)%answers.length]),false);
 }
 assert.throws(()=>quizCorrect(99,'ram'),RangeError);
});
