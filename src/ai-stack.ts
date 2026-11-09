/** Mathscape: modelos diminutos reproducibles, no pesos ni tokenizer de un LLM real. */
export type ExampleId='satellite'|'terrain'|'api';
export const examples={
 satellite:{prompt:'La imagen satelital contiene',candidates:['píxeles','montañas','internet'],logits:[2.1,0.5,-0.6]},
 terrain:{prompt:'La pendiente del terreno depende del',candidates:['desnivel','color','nombre'],logits:[2.2,0.1,-0.8]},
 api:{prompt:'Una respuesta HTTP informa un',candidates:['estado','satélite','ángulo'],logits:[2.4,-0.5,-0.7]},
} as const;
export function softmax(logits:readonly number[],temperature=1):number[]{
 if(!logits.length||logits.some(x=>!Number.isFinite(x))||!Number.isFinite(temperature)||temperature<=0)throw new RangeError('Logits o temperatura inválidos');
 const scaled=logits.map(x=>x/temperature),max=Math.max(...scaled);
 const exp=scaled.map(x=>Math.exp(x-max)),total=exp.reduce((s,v)=>s+v,0);
 return exp.map(x=>x/total);
}
export function chooseToken(probabilities:readonly number[],draw:number):number{
 if(!probabilities.length||probabilities.some(x=>!Number.isFinite(x)||x<0)||Math.abs(probabilities.reduce((s,v)=>s+v,0)-1)>1e-8||!Number.isFinite(draw)||draw<0||draw>1)throw new RangeError('Distribución o muestra inválida');
 let c=0;
 for(let i=0;i<probabilities.length;i++){c+=probabilities[i];if(draw<c)return i}
 return probabilities.length-1;
}
export function toyPrediction(id:ExampleId,temperature:number,draw:number){
 const model=examples[id],probabilities=softmax(model.logits,temperature);
 const chosen=chooseToken(probabilities,draw);
 return {prompt:model.prompt,candidates:model.candidates,logits:model.logits,probabilities,chosen,output:model.candidates[chosen]};
}
export function toyEncode(sentence:string){
 const pieces=sentence.trim().split(/\s+/u).filter(Boolean);
 if(pieces.length>16)throw new RangeError('Demasiadas piezas');
 return pieces.map(piece=>{
  let checksum=0;
  for(const character of piece)checksum=(checksum*31+character.codePointAt(0)!)%9973;
  const theta=checksum/9973*Math.PI*2;
  return {piece,id:checksum,vector:[Math.cos(theta),Math.sin(theta)] as const};
 });
}
export type AgentCase='geo'|'backend';
export type AgentStep={title:string;description:string;status:'ok'|'pending'|'blocked'};
export function agentTrace(kind:AgentCase,toolReady:boolean,acceptanceReady:boolean):AgentStep[]{
 const geo=kind==='geo';
 return [
  {title:'01 · Objetivo y criterio',description:geo?'Comparar dos alturas y citar su procedencia.':'Validar JSON y no aceptar campos ausentes.',status:'ok'},
  {title:'02 · Elegir herramienta',description:geo?'Solicitar elevaciones a una fuente identificada.':'Llamar al validador del contrato HTTP.',status:'ok'},
  {title:'03 · Entrada / salida',description:toolReady?(geo?'La consulta devuelve dos cotas con unidades.':'El validador devuelve un estado y errores estructurados.'):'La herramienta devuelve un error; no se inventan resultados.',status:toolReady?'ok':'blocked'},
  {title:'04 · Comprobar',description:!toolReady?'La verificación se detiene: faltan datos.':acceptanceReady?(geo?'Se comprueban unidades, fuente y consistencia.':'La prueba comprueba respuesta y efectos del rechazo.'):'No se cumple el criterio de aceptación: hace falta corregir o revisar.',status:!toolReady?'blocked':acceptanceReady?'ok':'pending'},
  {title:'05 · Resultado',description:toolReady&&acceptanceReady?'Listo para revisión humana. No implica publicación automática.':'Sin aprobación: registrar fallo y corregir antes de continuar.',status:toolReady&&acceptanceReady?'ok':'blocked'}
 ];
}
