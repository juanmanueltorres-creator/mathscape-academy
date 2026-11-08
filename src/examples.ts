import type {SceneId} from './content';

/** Los ejemplos son escenas independientes; al elegirlos se resetean solo las variables que los definen. */
export type Example={label:string;subtitle:string;params:Record<string,number>};
export const examples:Partial<Record<SceneId,Example[]>>={

 dem:[
  {label:'Punto central',subtitle:'Precordillera de San Juan, 81 muestras SRTM',params:{demX:4,demY:4,demContours:50,demDatum:2500}},
  {label:'Otro perfil',subtitle:'Moverse a la fila norte de la grilla',params:{demX:6,demY:2,demContours:75,demDatum:2600}}
 ],
 satellites:[
  {label:'Sentinel-2',subtitle:'Óptico · heliosincrónico · 786 km',params:{orbitModel:0,orbitTime:360}},
  {label:'SAOCOM',subtitle:'SAR banda L · CONAE · 620 km',params:{orbitModel:1,orbitTime:240}},
  {label:'GEO',subtitle:'Ideal ecuatorial · ≈35 786 km',params:{orbitModel:2,orbitTime:720}}
 ],
 radars:[
  {label:'Ecos de lluvia',subtitle:'Radar meteorológico · dBZ',params:{radarType:0,radarDbz:55}},
  {label:'Efecto Doppler',subtitle:'Velocidad radial · m/s',params:{radarType:1,radarWind:25,radarDirection:100,radarBearing:45}},
  {label:'Radar SAR',subtitle:'Retrodispersión de superficie · dB',params:{radarType:2,radarRoughness:.7,radarIncidence:35}}
 ],
 terrain:[
  {label:'Lomas y quebradas',subtitle:'Combinación de elevaciones gaussianas',params:{landform:0,irregularity:.8,gridN:20,datum:1100,pickX:100,pickY:-100}},
  {label:'Valle y cauce',subtitle:'Depresión curva y laderas asimétricas',params:{landform:1,irregularity:.6,gridN:22,datum:1025,pickX:50,pickY:50}},
  {label:'Ladera irregular',subtitle:'Pendiente regional con ondulaciones',params:{landform:2,irregularity:1.1,gridN:24,datum:1110,pickX:200,pickY:-75}}
 ],
 projection:[
  {label:'Equidistante',subtitle:'Agrandamiento hacia los polos',params:{projectionMode:0,probeLat:60,probeLon:-60}},
  {label:'Mercator',subtitle:'Conforme, agranda superficies',params:{projectionMode:1,probeLat:60,probeLon:20}},
  {label:'Equivalente',subtitle:'Conserva área en la esfera',params:{projectionMode:2,probeLat:60,probeLon:20}}
 ],
 raster:[
  {label:'Píxel grueso',subtitle:'8×8, se pierde detalle',params:{rasterN:8,rasterTerrain:0,rasterRough:.8,rasterMask:0}},
  {label:'Más resolución',subtitle:'40×40, más detalle',params:{rasterN:40,rasterTerrain:0,rasterRough:.8,rasterMask:0}},
  {label:'NoData',subtitle:'Ausencia de medición, no altura cero',params:{rasterN:40,rasterTerrain:1,rasterMask:1,rasterRough:.8}}
 ],
 sensors:[
  {label:'Color natural',subtitle:'RGB, visible ilustrativo',params:{sensorMode:0,sensorDryness:.1}},
  {label:'Falso color',subtitle:'Infrarrojo / rojo / verde',params:{sensorMode:1,sensorDryness:.1}},
  {label:'NDVI',subtitle:'Vegetación en rojo e NIR',params:{sensorMode:2,sensorDryness:.1}},
  {label:'NDWI',subtitle:'Agua con verde e NIR',params:{sensorMode:3,sensorDryness:.1}},
  {label:'Sequedad',subtitle:'Experimento, no observación real',params:{sensorMode:2,sensorDryness:.9}}
 ],
 limits:[
  {label:'sen(x) / x',subtitle:'Límite removible en x=0',params:{limitModel:0,lh:.45}},
  {label:'Hueco algebraico',subtitle:'(x²−1)/(x−1) en x=1',params:{limitModel:1,lh:.45}},
  {label:'Salto',subtitle:'Límites laterales distintos',params:{limitModel:2,lh:.45}}
 ],
 derivative:[
  {label:'Parábola',subtitle:'f(x)=x²',params:{derivativeModel:0,x0:1,h:.7}},
  {label:'Onda seno',subtitle:'f(x)=sen(x)',params:{derivativeModel:1,x0:.7,h:.7}},
  {label:'Exponencial',subtitle:'f(x)=eˣ',params:{derivativeModel:2,x0:.5,h:.7}}
 ],
 integral:[
  {label:'Cuadrática',subtitle:'x²/4 + 1/2',params:{integralModel:0,upper:2,n:12}},
  {label:'Onda positiva',subtitle:'1 + sen(x)',params:{integralModel:1,upper:2,n:12}},
  {label:'Rampa lineal',subtitle:'1 + x/2',params:{integralModel:2,upper:2,n:12}}
 ],
 double:[
  {label:'Cuadrática',subtitle:'Región cuadrada',params:{doubleModel:0,bound:1,amplitude:.45,resolution:9}},
  {label:'Cilindro',subtitle:'Altura constante sobre un disco',params:{doubleModel:1,bound:1.15,height:1.8,resolution:9}},
  {label:'Esfera completa',subtitle:'Espesor 2√(R²−r²)',params:{doubleModel:5,bound:1.25,resolution:16}},
  {label:'Hemisferio',subtitle:'Media esfera: z=√(R²−r²)',params:{doubleModel:2,bound:1.25,resolution:14}},
  {label:'Paraboloide',subtitle:'Cúpula parabólica sobre disco',params:{doubleModel:3,bound:1.2,height:1.9,resolution:12}},
  {label:'Cono',subtitle:'Altura decrece radialmente',params:{doubleModel:4,bound:1.2,height:2,resolution:12}}
 ],
 matrix:[
  {label:'Identidad',subtitle:'No transforma el plano',params:{ma:1,mb:0,mc:0,md:1}},
  {label:'Cizalla',subtitle:'Desplazamiento horizontal',params:{ma:1,mb:1,mc:0,md:1}},
  {label:'Rotación 90°',subtitle:'Giro sin cambiar áreas',params:{ma:0,mb:-1,mc:1,md:0}},
  {label:'Proyección',subtitle:'Se pierde una dimensión',params:{ma:1,mb:0,mc:0,md:0}}
 ],
 ode:[
  {label:'Decaimiento',subtitle:'y′=−0.6y',params:{odeModel:0,k:-.6,y0:2,dt:.35}},
  {label:'Crecimiento',subtitle:'y′=0.4y',params:{odeModel:0,k:.4,y0:1,dt:.35}},
  {label:'Logística',subtitle:'y′=ky(1−y/K)',params:{odeModel:1,k:1,y0:1,capacity:5,dt:.35}}
 ],
 gradient:[
  {label:'Cuenco',subtitle:'Paraboloide elíptico',params:{gradientModel:0,ga:.7,gb:.45,gx:.8,gy:.5}},
  {label:'Silla',subtitle:'Curvatura de signos opuestos',params:{gradientModel:1,ga:.7,gb:.45,gx:.8,gy:.5}},
  {label:'Campana',subtitle:'Superficie gaussiana',params:{gradientModel:2,ga:1.5,gb:.65,gx:.8,gy:.5}}
 ]
};
