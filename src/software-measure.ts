import type {Result,Metric} from './measure';
import {modelDecision} from './software';
const metric=(label:string,value:string):Metric=>({label,value});
export function calculateSoftware(view:'product'|'software',p:Record<string,number>):Result{
 const product=p.softwareProduct??0,mode=p.softwareMode??0,step=p.softwareStep??0;
 const {p:caseData,outcome,nodes}=modelDecision(product,mode);
 const active=nodes[Math.max(0,Math.min(5,Math.round(step)))];
 if(view==='product')return {
  metrics:[
   metric('Producto',caseData.name),
   metric('Acción',caseData.method),
   metric('Recorrido',nodes.length+' etapas')
  ],
  explanation:active.impact,
  observation:caseData.insight,
  formula:'NECESIDAD\n'+caseData.need+'\n\nVALOR\n'+caseData.metric,
  passed:step>=5,
 };
 return {
  metrics:[
   metric('Respuesta HTTP',String(outcome.status)),
   metric('Estado',outcome.state==='pending'?'Pendiente':outcome.state==='rejected'?'Rechazado':'Disponible'),
   metric('Capa',outcome.layer)
  ],
  explanation:active.detail,
  observation:outcome.message,
  formula:outcome.request+'\n'+outcome.response+'\n\nDECISIÓN · '+caseData.tradeoff,
  passed:mode===1&&outcome.state==='rejected'&&!outcome.changed,
 };
}
