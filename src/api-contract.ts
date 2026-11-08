/**
 * A simulated HTTP server, with explicit validation rules.
 * No network, persistence, uploads or financial transaction occurs.
 * The cases intentionally model generic APIs, not company endpoints.
 */
export type ContractId='terrain'|'social'|'bank';
export type PresetId='valid'|'missing'|'invalid'|'syntax';
export type ContractExample={
 id:ContractId;name:string;context:string;goal:string;endpoint:string;accent:string;
 required:readonly string[];initial:Readonly<Record<string,unknown>>;
 successStatus:201|202;successMessage:string;successPayload:Readonly<Record<string,unknown>>;
 invalidPayload:Readonly<Record<string,unknown>>;missingKey:string;insight:string
};
export const CONTRACT_CASES:readonly ContractExample[]=[
 {
  id:'terrain',name:'Terreno',context:'GEOESPACIAL',goal:'Pedir un análisis de pendiente.',
  endpoint:'POST /analisis/pendiente',accent:'#8fdac8',
  required:['bbox','crs','resolucion_m'],
  initial:{bbox:[-69.2,-31.5,-69.1,-31.4],crs:'EPSG:4326',resolucion_m:30},
  invalidPayload:{bbox:[-69.1,-31.5,-69.2,-31.4],crs:'EPSG:4326',resolucion_m:30},
  missingKey:'crs',successStatus:202,successMessage:'Análisis en preparación',
  successPayload:{id:'terreno-01',estado:'pendiente',unidad_pendiente:'grados'},
  insight:'Sin un CRS y un área válidos, ningún mapa puede interpretar bien la solicitud.'
 },
 {
  id:'social',name:'Publicación',context:'CONTENIDO',goal:'Crear una publicación con imagen.',
  endpoint:'POST /publicaciones',accent:'#ff8dc2',
  required:['titulo','archivo_mb','visibilidad'],
  initial:{titulo:'Paisaje de campo',archivo_mb:2.4,visibilidad:'privada'},
  invalidPayload:{titulo:'Paisaje de campo',archivo_mb:99,visibilidad:'privada'},
  missingKey:'visibilidad',successStatus:201,successMessage:'Publicación creada',
  successPayload:{id:'post-01',estado:'creada',visibilidad:'privada'},
  insight:'Un archivo grande o sin permiso no debería publicarse por accidente.'
 },
 {
  id:'bank',name:'Transferencia',context:'FINANZAS',goal:'Solicitar una transferencia segura.',
  endpoint:'POST /transferencias',accent:'#85dfbc',
  required:['destino','monto','moneda','clave_idempotencia'],
  initial:{destino:'cuenta-b',monto:250,moneda:'ARS',clave_idempotencia:'op-123'},
  invalidPayload:{destino:'cuenta-b',monto:1200,moneda:'ARS',clave_idempotencia:'op-123'},
  missingKey:'clave_idempotencia',successStatus:202,successMessage:'Solicitud recibida; todavía no liquidada',
  successPayload:{id:'op-123',estado:'pendiente',duplicados:0},
  insight:'Una transferencia aceptada para procesarse todavía no es dinero acreditado.'
 }
];
export function contractById(id:ContractId):ContractExample{
 const result=CONTRACT_CASES.find(example=>example.id===id);
 if(!result)throw new RangeError('Caso desconocido');
 return result;
}
export function presetBody(id:ContractId,preset:PresetId):string{
 const example=contractById(id);
 if(preset==='syntax')return '{"dato": 1,,}';
 const payload:Record<string,unknown>=preset==='invalid'
  ?{...example.invalidPayload}:{...example.initial};
 if(preset==='missing')delete payload[example.missingKey];
 return JSON.stringify(payload,null,2);
}
type Phase='syntax'|'structure'|'rule'|'accepted';
export type ContractResponse={
 status:400|422|201|202;phase:Phase;title:string;message:string;
 body:Readonly<Record<string,unknown>>;responseJson:string;ok:boolean
};
function answer(status:ContractResponse['status'],phase:Phase,title:string,message:string,payload:Record<string,unknown>):ContractResponse{
 return {status,phase,title,message,body:payload,responseJson:JSON.stringify(payload,null,2),ok:status===201||status===202};
}
const isRecord=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const finite=(v:unknown):v is number=>typeof v==='number'&&Number.isFinite(v);
function businessError(id:ContractId,record:Record<string,unknown>):string|null{
 if(id==='terrain'){
  const {bbox,crs,resolucion_m}=record;
  if(!Array.isArray(bbox)||bbox.length!==4||!bbox.every(finite))return 'bbox debe tener cuatro números: oeste, sur, este, norte.';
  const [west,south,east,north]=bbox as number[];
  if(west < -180||east>180||south < -90||north>90||east<=west||north<=south||west>=180||east<=-180)return 'bbox requiere límites geográficos ordenados y válidos.';
  if((east-west)*(north-south)>4)return 'Área demasiado extensa para este ejemplo (máximo 4 grados²).';
  if(crs!=='EPSG:4326')return 'Esta demostración admite únicamente EPSG:4326.';
  if(!finite(resolucion_m)||resolucion_m<10||resolucion_m>250)return 'resolucion_m debe estar entre 10 y 250 metros.';
  return null;
 }
 if(id==='social'){
  const {titulo,archivo_mb,visibilidad}=record;
  if(typeof titulo!=='string'||!titulo.trim()||titulo.length>80)return 'titulo requiere entre 1 y 80 caracteres.';
  if(!finite(archivo_mb)||archivo_mb<=0||archivo_mb>15)return 'archivo_mb debe ser mayor que 0 y hasta 15 MB.';
  if(visibilidad!=='privada'&&visibilidad!=='publica')return 'visibilidad debe ser privada o publica.';
  return null;
 }
 const {destino,monto,moneda,clave_idempotencia}=record;
 if(typeof destino!=='string'||!/^cuenta-[a-z0-9-]{1,20}$/.test(destino))return 'destino debe tener el formato cuenta-...';
 if(!finite(monto)||monto<=0||monto>800)return 'monto debe ser mayor que 0 y no superar el saldo didáctico de 800 ARS.';
 if(moneda!=='ARS')return 'Esta cuenta didáctica solo admite ARS.';
 if(typeof clave_idempotencia!=='string'||!/^op-[a-zA-Z0-9-]{1,40}$/.test(clave_idempotencia))return 'clave_idempotencia debe comenzar por op-.';
 return null;
}
export function evaluateContract(id:ContractId,raw:string):ContractResponse{
 const contract=contractById(id);
 if(raw.length>4000)return answer(400,'syntax','Solicitud demasiado grande','El ejemplo acepta como máximo 4000 caracteres.',{error:'body_too_large'});
 let parsed:unknown;
 try{parsed=JSON.parse(raw)}catch{
  return answer(400,'syntax','JSON incompleto','El servidor no puede interpretar la sintaxis. Revisá comas y comillas.',{error:'invalid_json'});
 }
 if(!isRecord(parsed))return answer(422,'structure','Se esperaba un objeto','El cuerpo JSON debe ser un objeto con campos nombrados.',{error:'expected_object'});
 const missing=contract.required.filter(key=>!Object.prototype.hasOwnProperty.call(parsed,key));
 if(missing.length)return answer(422,'structure','Faltan datos','Campo requerido: '+missing.join(', ')+'.',{error:'required',campos:missing});
 const allowed=new Set(contract.required);
 const extra=Object.keys(parsed).filter(key=>!allowed.has(key));
 if(extra.length)return answer(422,'structure','Campos desconocidos','Este contrato no admite: '+extra.join(', ')+'.',{error:'additional_properties',campos:extra});
 const problem=businessError(id,parsed);
 if(problem)return answer(422,'rule','Regla incumplida',problem,{error:'validation_failed',detalle:problem});
 return answer(contract.successStatus,'accepted',contract.successStatus===201?'Recurso creado':'Solicitud aceptada',contract.successMessage,{...contract.successPayload});
}
