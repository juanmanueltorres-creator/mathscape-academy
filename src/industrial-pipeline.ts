/** Casos industriales DIDÁCTICOS, no reconstrucciones de sistemas empresariales reales. */
export const technicalStages = [
 {id:'need',title:'01 · Necesidad',question:'¿Qué problema operativo hay que resolver?',note:'Antes de elegir un sensor se define qué decisión necesita el usuario.'},
 {id:'measure',title:'02 · Medición',question:'¿Qué variable física responde esa pregunta?',note:'Un sensor produce señales o medidas, no una conclusión profesional.'},
 {id:'edge',title:'03 · Electrónica',question:'¿Cómo se adquiere y registra la señal?',note:'Acondicionamiento, calibración, fecha, unidades y control de calidad.'},
 {id:'power',title:'04 · Energía',question:'¿Puede operar de forma sostenida?',note:'Consumo, autonomía, respaldo y mantenimiento según condiciones reales.'},
 {id:'link',title:'05 · Comunicación',question:'¿Cómo viajan los datos?',note:'La cobertura y la latencia determinan cuándo llegan a destino.'},
 {id:'data',title:'06 · Datos y GIS',question:'¿Cómo se vuelve utilizable la medición?',note:'Ingesta, procedencia, validación, ubicación y acceso desde el software.'},
 {id:'decision',title:'07 · Decisión',question:'¿Quién actúa y con qué responsabilidad?',note:'La decisión humana o automatizada requiere límites, permisos y evidencia.'}
] as const;
export const commercialStages = [
 {id:'problem',title:'Problema',detail:'Identificar un costo, demora, riesgo o necesidad verificable.'},
 {id:'contact',title:'Contacto',detail:'Hablar con especialistas, responsables de operación y compradores.'},
 {id:'diagnosis',title:'Diagnóstico',detail:'Acordar alcance, datos disponibles, restricciones y criterio de éxito.'},
 {id:'pilot',title:'Piloto',detail:'Comprobar un caso acotado antes de prometer un despliegue.'},
 {id:'contract',title:'Compra',detail:'Revisión técnica, presupuesto, condiciones, seguridad y contrato.'},
 {id:'support',title:'Soporte',detail:'Puesta en marcha, capacitación, monitoreo y mantenimiento.'}
] as const;
export const industrialCases = {
 core: {
  label:'Minería · testigos',
  problem:'Documentar y caracterizar testigos de perforación sin perder contexto.',
  variable:'Respuesta óptica, espectral o elemental de la muestra, según el instrumento.',
  sensor:'Cámara y técnicas espectrales/XRF como familias posibles; no todos los equipos emplean las mismas.',
  edge:'Captura e identificación de muestra, calibración y archivo de adquisición.',
  energy:'Alimentación y respaldo dimensionados para el entorno de escaneo.',
  link:'Red local o transferencia de archivos hacia el equipo de interpretación.',
  data:'Vincular identificadores, profundidad, unidades, controles de calidad y visualización geológica/GIS.',
  decision:'Especialistas evalúan intervalos y definen próximos análisis; el sensor no reemplaza su criterio.',
  value:'Menor retrabajo documental y mejor trazabilidad, si se demuestra en un piloto.',
  buyer:'Equipo de exploración, geología y gestión de datos.',
  caution:'Caso conceptual: no representa la arquitectura ni los sensores exactos de una empresa particular.'
 },
 pipeline: {
  label:'Petróleo y gas · ducto',
  problem:'Conocer el paso de un dispositivo de limpieza por tramos de un gasoducto.',
  variable:'Evento físico asociado al paso del dispositivo; puede registrarse mediante vibración u otros métodos.',
  sensor:'Detector de vibración o de paso, según ingeniería y sitio.',
  edge:'Adquisición del evento, reloj, identificador de estación y almacenamiento local si corresponde.',
  energy:'Batería/red/panel solar según acceso y autonomía requerida.',
  link:'Celular, radio u otro medio disponible; no se presupone cobertura continua.',
  data:'Series temporales, ubicación de estaciones, registro de eventos y visualización de avance estimado.',
  decision:'Operadores interpretan el seguimiento; detectar no significa controlar el movimiento del dispositivo.',
  value:'Mayor visibilidad operacional y coordinación, si la detección es confiable.',
  buyer:'Operación de ductos, mantenimiento e integradores.',
  caution:'Ejemplo didáctico basado en un tipo de operación; no describe un sistema real ni una posición en vivo.'
 },
 network: {
  label:'Telecom · red en campo',
  problem:'Mantener coherentes los planos de diseño, los activos instalados y la documentación.',
  variable:'Posición y estado documentado de un tramo, gabinete, enlace o equipo.',
  sensor:'Relevamiento, GPS/GNSS y documentación técnica; no toda fuente es un sensor automático.',
  edge:'Registro de activos, fotos, identificadores y validaciones en terreno.',
  energy:'Alimentación de equipos de red y de dispositivos de campo según tarea.',
  link:'Sincronización oficina-campo sobre conectividad variable.',
  data:'CAD → GIS, geometrías, atributos, versiones y separación diseño/as-built.',
  decision:'Ingeniería y cuadrillas comprueban documentación antes de intervenir.',
  value:'Menos inconsistencias y mejor coordinación entre oficina y terreno.',
  buyer:'Operadores, contratistas, ingeniería de redes.',
  caution:'Ejemplo conceptual; el trabajo de documentación remota no implica por sí mismo una app offline-first.'
 }
} as const;

export type IndustrialCaseId=keyof typeof industrialCases;
export type Connectivity='online'|'offline';
export type Power='available'|'failed';
export function systemState(connectivity:Connectivity,power:Power){
 if(power==='failed') return {
  id:'stopped' as const,
  title:'Sin alimentación',
  detail:'El dispositivo no puede adquirir datos nuevos. La comunicación tampoco resuelve el corte eléctrico.',
  local:false,remote:false
 };
 if(connectivity==='offline') return {
  id:'buffering' as const,
  title:'Medición local; envío pendiente',
  detail:'Suponiendo almacenamiento local configurado, los eventos quedan pendientes de sincronización. La oficina no tiene información nueva en tiempo real.',
  local:true,remote:false
 };
 return {
  id:'connected' as const,
  title:'Datos enviados; validación pendiente',
  detail:'La transmisión funciona, pero recibir datos no prueba precisión, interpretación ni autorización para actuar.',
  local:true,remote:true
 };
}
export function stageDetail(caseId:IndustrialCaseId,stageId:typeof technicalStages[number]['id']):string{
 const item=industrialCases[caseId];
 const byStage={
  need:item.problem,measure:item.variable+' '+item.sensor,edge:item.edge,
  power:item.energy,link:item.link,data:item.data,decision:item.decision
 };
 return byStage[stageId];
}
