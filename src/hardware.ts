/**
 * A conceptual walk through a computer and a web application.
 * Illustrated diagrams are NOT hardware measurements or network traces.
 * A remote server is a second machine, not "inside" the user's computer.
 */
export type HardwarePartId='cpu'|'ram'|'ssd'|'nic'|'motherboard'|'gpu';
export type JourneyId='boot'|'web';
export type FaultId='none'|'offline'|'server';
export type HardwarePart={
 id:HardwarePartId;label:string;short:string;function:string;example:string;avoid:string;accent:string;
};
export const PARTS:readonly HardwarePart[]=[
 {id:'cpu',label:'CPU',short:'Procesador',function:'Ejecuta instrucciones de los programas y del sistema operativo.',example:'El navegador necesita CPU para interpretar código y construir la página.',avoid:'No almacena los archivos de forma persistente.',accent:'#7ed9ff'},
 {id:'ram',label:'RAM',short:'Memoria',function:'Mantiene temporalmente datos e instrucciones de procesos activos.',example:'Las pestañas abiertas consumen RAM mientras la computadora funciona.',avoid:'En condiciones normales, su contenido se pierde al apagar.',accent:'#90e5c2'},
 {id:'ssd',label:'SSD',short:'Almacenamiento',function:'Conserva archivos, aplicaciones y el sistema operativo sin energía.',example:'El navegador instalado vive en el disco antes de ejecutarse.',avoid:'No reemplaza la memoria RAM usada al ejecutar programas.',accent:'#ffd397'},
 {id:'nic',label:'Red',short:'Adaptador',function:'Conecta la máquina a una red física o inalámbrica.',example:'Envía y recibe datos a través de Ethernet o Wi‑Fi.',avoid:'No interpreta por sí mismo lo que significa una respuesta HTTP.',accent:'#b8abff'},
 {id:'motherboard',label:'Placa madre',short:'Conexiones',function:'Integra CPU, memoria, almacenamiento, buses y dispositivos.',example:'Los buses transportan datos entre componentes del equipo.',avoid:'No es un sistema operativo ni una aplicación.',accent:'#68c9d5'},
 {id:'gpu',label:'GPU',short:'Gráficos',function:'Acelera operaciones paralelas y tareas de visualización cuando está disponible.',example:'Puede ayudar a dibujar mapas 3D y escenas complejas.',avoid:'No es obligatoria una GPU dedicada para navegar por la web.',accent:'#f3a7dd'}
];
export function getPart(id:HardwarePartId):HardwarePart{
 const found=PARTS.find(part=>part.id===id);
 if(!found)throw new RangeError('Componente desconocido');
 return found;
}
export type SystemLayer={
 id:'hardware'|'os'|'network'|'services'|'experience';name:string;
 summary:string;examples:string;why:string;accent:string
};
export const LAYERS:readonly SystemLayer[]=[
 {id:'hardware',name:'Máquina física',summary:'CPU, memoria, disco y red hacen posible la ejecución.',examples:'CPU · RAM · SSD · NIC',why:'La máquina aporta recursos; no define por sí sola el producto.',accent:'#82c8ff'},
 {id:'os',name:'Sistema operativo',summary:'El kernel gestiona procesos, memoria, archivos y dispositivos.',examples:'Linux · Windows · kernel · drivers',why:'Los programas acceden a recursos usando servicios del sistema.',accent:'#8be5b3'},
 {id:'network',name:'Red y protocolos',summary:'DNS, TCP/IP, TLS y HTTP permiten comunicarse entre máquinas.',examples:'DNS · TCP/IP · TLS · HTTPS',why:'La red conecta el equipo cliente con servicios de otros equipos.',accent:'#6fe4e3'},
 {id:'services',name:'Lógica y datos',summary:'Los servicios aplican reglas, consultan datos y construyen respuestas.',examples:'API · backend · base de datos · colas',why:'No todo vive en un solo servidor: las piezas pueden distribuirse.',accent:'#b9a4ff'},
 {id:'experience',name:'Aplicación',summary:'Interfaz y comportamiento que la persona ve y controla.',examples:'Navegador · mapa · formulario',why:'La utilidad se juzga por lo que la persona logra hacer.',accent:'#f0afd8'}
];
export type JourneyStep={layer:SystemLayer['id'];heading:string;action:string;detail:string;machine:'local'|'remote'|'both'};
export const JOURNEYS:Record<JourneyId,readonly JourneyStep[]>={
 boot:[
  {layer:'hardware',heading:'Se enciende',action:'Firmware inicializa los componentes.',detail:'El firmware (UEFI/BIOS, según el equipo) hace comprobaciones e inicia la secuencia de arranque.',machine:'local'},
  {layer:'hardware',heading:'Carga el sistema',action:'El cargador localiza el kernel.',detail:'Un bootloader habitual carga el kernel del sistema operativo desde almacenamiento hasta memoria.',machine:'local'},
  {layer:'os',heading:'El kernel toma control',action:'Prepara memoria, procesos y dispositivos.',detail:'El kernel inicializa controladores y mecanismos de gestión; el orden exacto varía entre sistemas.',machine:'local'},
  {layer:'os',heading:'Inician los servicios',action:'Se preparan procesos del sistema.',detail:'Los servicios de usuario pueden iniciar en segundo plano, como red, registro y sesión.',machine:'local'},
  {layer:'experience',heading:'Abrís una aplicación',action:'El sistema crea o activa un proceso.',detail:'El ejecutable se carga en memoria y la CPU trabaja sobre sus instrucciones.',machine:'local'}
 ],
 web:[
  {layer:'experience',heading:'Escribís una dirección',action:'El navegador prepara la navegación.',detail:'Se interpreta la URL. Puede haber recursos guardados en caché.',machine:'local'},
  {layer:'network',heading:'Resuelve el dominio',action:'DNS obtiene una dirección, si hace falta.',detail:'El resolvedor puede usar caché antes de consultar un servidor DNS.',machine:'both'},
  {layer:'os',heading:'Establece una conexión',action:'La pila de red participa en TCP y TLS.',detail:'Para HTTPS sobre TCP, el sistema y el navegador establecen transporte y protección. HTTP/3 usa QUIC en lugar de TCP.',machine:'local'},
  {layer:'hardware',heading:'Sale por la red',action:'El adaptador transmite datos.',detail:'La interfaz de red envía tramas a la red; los routers encaminan paquetes hasta el destino.',machine:'both'},
  {layer:'services',heading:'Responde el servidor',action:'Una aplicación remota procesa la solicitud.',detail:'El servidor puede usar CPU, RAM y disco propios y consultar otra base de datos o servicio.',machine:'remote'},
  {layer:'network',heading:'Vuelve la respuesta',action:'El navegador recibe contenido o un error.',detail:'HTTP entrega estados, encabezados y contenido de respuesta. No garantiza que toda app haya terminado su trabajo.',machine:'both'},
  {layer:'experience',heading:'Aparece la página',action:'El navegador interpreta y dibuja.',detail:'HTML, CSS y JavaScript participan en la experiencia. Un mapa puede necesitar después otras solicitudes.',machine:'local'}
 ]
};
export type JourneyState={
 step:JourneyStep;stepIndex:number;blocked:boolean;blockIndex:number|null;
 fault:FaultId;headline:string;reason:string;completed:boolean;machine:'local'|'remote'|'both'
};
export function journeyState(journey:JourneyId,index:number,fault:FaultId='none'):JourneyState{
 const steps=JOURNEYS[journey];
 if(!Number.isFinite(index))throw new RangeError('Paso inválido');
 const stepIndex=Math.max(0,Math.min(steps.length-1,Math.round(index)));
 const blockIndex=journey==='web'&&fault==='offline'?3:journey==='web'&&fault==='server'?4:null;
 const blocked=blockIndex!==null&&stepIndex>=blockIndex;
 const step=steps[Math.min(stepIndex,blockIndex??stepIndex)];
 const reason=blockIndex===3?'Sin conexión: los datos no pueden salir del equipo.':
  blockIndex===4?'El servicio remoto no está respondiendo. El navegador debe mostrar un estado de error.':
  'La secuencia continúa.';
 return {step,stepIndex,blocked,blockIndex,fault,
  headline:blocked?(blockIndex===3?'Red desconectada':'Servicio no disponible'):step.heading,
  reason:blocked?reason:step.detail,
  completed:stepIndex===steps.length-1&&!blocked,machine:step.machine};
}
export const HARDWARE_QUIZ=[
 {question:'¿Qué ejecuta las instrucciones del navegador?',answer:'cpu' as HardwarePartId},
 {question:'¿Dónde están los datos temporales de una pestaña activa?',answer:'ram' as HardwarePartId},
 {question:'¿Qué conserva los archivos cuando apagás el equipo?',answer:'ssd' as HardwarePartId}
] as const;
export function quizCorrect(index:number,id:HardwarePartId):boolean{
 const q=HARDWARE_QUIZ[index];
 if(!q)throw new RangeError('Pregunta inválida');
 return q.answer===id;
}
