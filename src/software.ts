/**
 * Tres recorridos de producto que comparten conceptos, no tecnología inventada.
 * Todos los endpoints, respuestas y estados son ejemplos DIDÁCTICOS:
 * no describen APIs internas de Instagram, Google Maps o bancos.
 */
export type ProductId='maps'|'social'|'bank';
export type RunMode='ok'|'invalid'|'retry';
export type SoftwareStep={
 label:string;layer:string;action:string;impact:string;detail:string;token:string
};
export type ProductCase={
 id:ProductId;name:string;eyebrow:string;promise:string;need:string;metric:string;
 action:string;method:'GET'|'POST';endpoint:string;accent:string;nodes:readonly SoftwareStep[];
 success:string;failure:string;insight:string;tradeoff:string;
};
export const PRODUCTS:readonly ProductCase[]=[
 {
  id:'maps',name:'Rutas',eyebrow:'MOVILIDAD',promise:'Llegar a destino sin perder tiempo.',
  need:'Necesito elegir un recorrido posible.',metric:'Tiempo hasta obtener la ruta y calidad del ETA.',
  action:'Pedir una ruta',method:'GET',endpoint:'/rutas?origen=A&destino=B',accent:'#74baff',
  success:'Ruta calculada · 18 min',failure:'Origen inválido · revisá las coordenadas',
  insight:'Una ruta útil depende tanto del grafo vial como de datos recientes.',
  tradeoff:'Precisión y actualización frente a latencia.',
  nodes:[
   {label:'Interfaz',layer:'UI',action:'Selecciona origen y destino.',impact:'Entradas claras evitan errores.',detail:'La persona indica qué quiere hacer antes de que exista una consulta.',token:'01'},
   {label:'Solicitud',layer:'HTTP',action:'GET /rutas con parámetros.',impact:'Respuesta o error visible.',detail:'El navegador envía una petición; no calcula rutas por sí solo.',token:'02'},
   {label:'Validación',layer:'API',action:'Comprueba puntos y opciones.',impact:'Frena coordenadas inválidas.',detail:'Una petición sintácticamente correcta todavía puede contener datos sin sentido.',token:'03'},
   {label:'Motor',layer:'ALGORITMO',action:'Busca recorridos en un grafo.',impact:'Elige alternativas factibles.',detail:'El grafo representa conexiones y restricciones, no solo líneas dibujadas.',token:'04'},
   {label:'Datos',layer:'GEO',action:'Combina calles y restricciones.',impact:'Las rutas cambian con la realidad.',detail:'Un cálculo preciso sobre un mapa desactualizado puede llevarte mal.',token:'05'},
   {label:'Entrega',layer:'RESPUESTA',action:'Devuelve recorrido y ETA.',impact:'Permite decidir y navegar.',detail:'El éxito es llegar mejor, no solamente renderizar una polilínea.',token:'06'}
  ]
 },
 {
  id:'social',name:'Publicaciones',eyebrow:'CONTENIDO',promise:'Compartir una imagen sin perderla.',
  need:'Quiero publicar una foto para otras personas.',metric:'Publicación completa y tiempo hasta que sea visible.',
  action:'Publicar una foto',method:'POST',endpoint:'/publicaciones',accent:'#ff81c2',
  success:'Publicación creada · visible',failure:'Archivo demasiado grande · rechazado',
  insight:'Subir un archivo y hacerlo visible no son necesariamente una sola operación.',
  tradeoff:'Rapidez frente a procesamiento, moderación y privacidad.',
  nodes:[
   {label:'Interfaz',layer:'UI',action:'Selecciona la imagen.',impact:'Muestra tamaño y vista previa.',detail:'La experiencia comienza con una elección humana, no con la nube.',token:'01'},
   {label:'Solicitud',layer:'HTTP',action:'POST /publicaciones.',impact:'Informa carga y reintentos.',detail:'El envío representa una petición ilustrativa; ningún archivo real sale del laboratorio.',token:'02'},
   {label:'Validación',layer:'API',action:'Revisa formato y permisos.',impact:'Evita contenido no válido.',detail:'Una respuesta no debería prometer publicación si todavía no está confirmada.',token:'03'},
   {label:'Proceso',layer:'BACKEND',action:'Prepara versiones de la imagen.',impact:'Mejora entrega y compatibilidad.',detail:'Las tareas pueden ejecutarse de forma asíncrona para no bloquear la interfaz.',token:'04'},
   {label:'Datos',layer:'STORAGE',action:'Guarda archivo y metadatos.',impact:'Permite recuperar el contenido.',detail:'El archivo y sus metadatos suelen tener necesidades de almacenamiento distintas.',token:'05'},
   {label:'Entrega',layer:'RESPUESTA',action:'Confirma estado y resultado.',impact:'La persona entiende qué pasó.',detail:'Una buena interfaz separa cargando, procesando, publicado y error.',token:'06'}
  ]
 },
 {
  id:'bank',name:'Transferencias',eyebrow:'FINANZAS',promise:'Mover dinero sin duplicar operaciones.',
  need:'Quiero transferir dinero de forma segura.',metric:'Integridad de saldos y estados verificables.',
  action:'Solicitar transferencia',method:'POST',endpoint:'/transferencias',accent:'#79e0b8',
  success:'Operación recibida · pendiente',failure:'Saldo insuficiente · no se debitó',
  insight:'Una respuesta rápida vale menos que una operación íntegra.',
  tradeoff:'Consistencia y auditoría frente a confirmación inmediata.',
  nodes:[
   {label:'Interfaz',layer:'UI',action:'Confirma destinatario e importe.',impact:'Disminuye errores humanos.',detail:'Antes de pedir una operación irreversible, la persona debe entender qué confirma.',token:'01'},
   {label:'Solicitud',layer:'HTTP',action:'POST con clave de idempotencia.',impact:'Repetir no duplica el movimiento.',detail:'Una misma clave permite identificar reintentos de una misma intención, no nuevas transferencias.',token:'02'},
   {label:'Seguridad',layer:'AUTH',action:'Autentica y autoriza.',impact:'Protege identidad y acceso.',detail:'El servidor debe verificar permisos; recibir un token no alcanza para decidir.',token:'03'},
   {label:'Reglas',layer:'BACKEND',action:'Verifica saldo, límites y riesgo.',impact:'Rechaza solicitudes inválidas.',detail:'Las reglas de negocio existen para prevenir operaciones incorrectas.',token:'04'},
   {label:'Transacción',layer:'DATOS',action:'Registra movimientos atómicos.',impact:'Evita estados parciales.',detail:'Una base transaccional mantiene consistencia; débito y crédito no deben divergir.',token:'05'},
   {label:'Estado',layer:'RESPUESTA',action:'Expone pendiente o confirmado.',impact:'Evita anunciar éxitos falsos.',detail:'Recibido no equivale a liquidado. El estado final depende del procesamiento real.',token:'06'}
  ]
 }
];
export function productByIndex(index:number):ProductCase{
 if(!Number.isFinite(index))throw new RangeError('Producto inválido');
 return PRODUCTS[Math.max(0,Math.min(PRODUCTS.length-1,Math.round(index)))];
}
export type Outcome={status:number;state:'success'|'pending'|'rejected';heading:string;message:string;request:string;response:string;changed:boolean;idempotent:boolean;layer:string};
export function simulateSoftware(productIndex:number,modeIndex:number):Outcome{
 const product=productByIndex(productIndex);
 const mode=Math.max(0,Math.min(2,Math.round(modeIndex)));
 const request=product.method+' '+product.endpoint;
 if(mode===1){
  const status=product.id==='social'?413:422;
  return {status,state:'rejected',heading:'Solicitud rechazada',message:product.failure,request,response:status+' '+(status===413?'Payload Too Large':'Unprocessable Content'),changed:false,idempotent:false,layer:product.id==='bank'?'Reglas':product.id==='social'?'Validación':'API'};
 }
 if(mode===2&&product.id==='bank'){
  return {status:200,state:'success',heading:'Respuesta existente',message:'Misma clave → misma operación. Sin segundo débito.',request,response:'200 OK · op-123 (sin duplicación)',changed:false,idempotent:true,layer:'Idempotencia'};
 }
 if(mode===2&&product.id==='social'){
  return {status:200,state:'success',heading:'Estado recuperado',message:'Se consulta el estado anterior; no se vuelve a publicar.',request:'GET /publicaciones/op-123',response:'200 OK · publicación existente',changed:false,idempotent:true,layer:'Estado'};
 }
 if(mode===2){
  return {status:200,state:'success',heading:'Consulta repetida',message:'Una ruta puede consultarse otra vez con nuevos datos.',request,response:'200 OK · ruta recalculada',changed:true,idempotent:false,layer:'Motor'};
 }
 return product.id==='bank'
  ?{status:202,state:'pending',heading:'Operación recibida',message:product.success,request,response:'202 Accepted · op-123 / pendiente',changed:true,idempotent:false,layer:'Estado'}
  :{status:product.id==='social'?201:200,state:'success',heading:'Respuesta disponible',message:product.success,request,response:product.id==='social'?'201 Created · post-123':'200 OK · ETA 18 min',changed:true,idempotent:false,layer:'Entrega'};
}
export function modelDecision(productIndex:number,modeIndex:number){
 const p=productByIndex(productIndex),outcome=simulateSoftware(productIndex,modeIndex);
 return {p,outcome,priority:p.tradeoff,metric:p.metric,nodes:p.nodes};
}
