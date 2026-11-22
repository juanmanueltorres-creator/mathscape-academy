/** G5 — mathematical toy models. NEVER render their numbers as official statistics. */
export type DataExperiment='quality'|'sampling'|'prices'|'purchasing';
export const evidenceLevels=[
 {label:'OPERACIÓN',title:'Dato individual',example:'Lectura de presión, medición de un pozo, viaje registrado.',risk:'Sensor, hora, unidad, calibración o evento duplicado.'},
 {label:'EMPRESA',title:'Indicador de gestión',example:'Disponibilidad, costo por unidad, producción consolidada.',risk:'Definición de KPI, sistemas desconectados, período y granularidad.'},
 {label:'SECTOR / ESTADO',title:'Estadística agregada',example:'Producción nacional, mercado de trabajo, precios, ingresos.',risk:'Cobertura, declaraciones, encuestas, población y metodología.'},
 {label:'PLATAFORMAS',title:'Comportamiento digital',example:'Búsquedas, clics e interacciones en servicios digitales.',risk:'Ser usuario de una plataforma no implica representar a toda la población.'}
] as const;
export const officialIndicators=[
 {key:'ipc',name:'IPC · Inflación',what:'Variación de los precios de una canasta representativa del consumo de hogares urbanos.',how:'Índice de precios, canasta, ponderaciones, relevamiento y período base.',caution:'Canasta, pesos y cobertura importan. Inflación menor no significa precios menores.',source:'INDEC · Precios al consumidor',url:'https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31-0'},
 {key:'wages',name:'Índice de salarios',what:'Evolución de las remuneraciones nominales de distintos sectores.',how:'Comparar nominales con IPC, utilizando períodos compatibles, permite estimar variación del poder adquisitivo.',caution:'Un índice salarial no representa cada empleo ni todos los ingresos. No confundir nominal con real.',source:'INDEC · Informes técnicos de salarios',url:'https://www.indec.gob.ar/uploads/informesdeprensa/salarios_11_2682D43EDD23.pdf'},
 {key:'poverty',name:'Pobreza por ingresos',what:'Proporción de personas u hogares cuyos ingresos no cubren la Canasta Básica Total.',how:'EPH + ingresos del hogar + línea de pobreza ajustada al hogar.',caution:'Hogares y personas son denominadores distintos; EPH tiene cobertura y error muestral.',source:'INDEC · Metodología de pobreza',url:'https://www.indec.gob.ar/ftp/cuadros/sociedad/EPH_metodologia_22_pobreza.pdf'},
 {key:'jobs',name:'Desocupación',what:'Personas desocupadas como porcentaje de la población económicamente activa (PEA).',how:'Desocupados / PEA × 100; no es desocupados / población total.',caution:'Las definiciones de actividad y búsqueda laboral importan; no mide todo el subempleo.',source:'INDEC · Mercado de trabajo',url:'https://www.indec.gob.ar/Nivel4/Tema/4/31/58'}
] as const;
export const observations:[number,number,null,number,number]=[10,12,null,16,20];
export function qualityDemo(missingAsZero:boolean,repeatLast:boolean){
 const supplied=repeatLast?[...observations,20]:[...observations];
 const valid=supplied.filter((v):v is number=>v!==null);
 const sum=valid.reduce((a,b)=>a+b,0);
 const denominator=missingAsZero?supplied.length:valid.length;
 return {
  value:sum/denominator,
  reference:[10,12,16,20].reduce((a,b)=>a+b,0)/4,
  missing:supplied.length-valid.length,
  duplicates:repeatLast?1:0,
  used:denominator,
  rows:supplied.length
 };
}
export function samplingDemo(sampleShareB:number){
 const share=Math.min(1,Math.max(0,sampleShareB/100));
 // Toy population: A=70%, B=30%. Distinct response rates 20% and 70%.
 const population=0.7*20+0.3*70;
 const naiveSample=(1-share)*20+share*70;
 return {population,naiveSample,gap:naiveSample-population,sampleShareB:share*100,
  populationShareB:30};
}
export function cpiToyDemo(housingWeight:number){
 const housing=Math.min(80,Math.max(10,housingWeight));
 const remaining=100-housing;
 const food=remaining*0.625;
 const transport=remaining-food;
 const changes=[10,30,5] as const; // illustrative percent changes by category
 const weights=[food,housing,transport] as const;
 const index=weights.reduce((sum,w,i)=>sum+w*changes[i]/100,0);
 return {index,food,housing,transport,changes};
}
export function purchasingPower(nominalPct:number,pricePct:number){
 if(pricePct<=-100) throw Error('Price change must be greater than -100%');
 return ((1+nominalPct/100)/(1+pricePct/100)-1)*100;
}
export const numberFormat=(n:number,places=1)=>n.toLocaleString('es-AR',{minimumFractionDigits:places,maximumFractionDigits:places});
