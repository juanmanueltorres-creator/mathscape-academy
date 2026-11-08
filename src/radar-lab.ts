/** Compare distinct radar measurement principles. Every generated value here is SYNTHETIC. */
export const RADAR_KINDS=[
 {name:'Radar meteorológico · reflectividad',unit:'dBZ',principle:'Ecos de hidrometeoros en la atmósfera',source:'https://www.noaa.gov/jetstream/reflectivity'},
 {name:'Radar meteorológico · Doppler',unit:'m/s',principle:'Velocidad radial de dispersores respecto del radar',source:'https://www.noaa.gov/jetstream/velocity'},
 {name:'Radar satelital · SAR',unit:'dB σ⁰',principle:'Retrodispersión de la superficie, no lluvia meteorológica',source:'https://www.argentina.gob.ar/ciencia/conae/misiones-espaciales/saocom/caracteristicas-tecnicas'}
] as const;
const rad=(d:number)=>d*Math.PI/180;
export function dbzToLinear(dbz:number){
 if(!Number.isFinite(dbz)||dbz< -100||dbz>100)throw new RangeError('Reflectividad fuera de rango');
 return Math.pow(10,dbz/10);
}
export function linearToDbz(z:number){
 if(!Number.isFinite(z)||z<=0)throw new RangeError('Z tiene que ser positivo');
 return 10*Math.log10(z);
}
/** Positive = moving away from the radar, negative = towards it. */
export function radialVelocity(speed:number,windToDeg:number,radarBearingDeg:number){
 if(!Number.isFinite(speed)||speed<0)throw new RangeError('Velocidad inválida');
 return speed*Math.cos(rad(windToDeg-radarBearingDeg));
}
/** An illustrative cell field, not a physically calibrated weather-radar product. */
export function syntheticReflectivity(x:number,y:number,peakDbz=52){
 const g=(cx:number,cy:number,s:number)=>Math.exp(-((x-cx)**2+(y-cy)**2)/(2*s*s));
 return Math.max(-10,peakDbz*g(.27,-.12,.22)+.5*peakDbz*g(-.3,.24,.16)-10);
}
/** Illustrative radar return only: this is NOT a backscatter-calibrated SAR model. */
export function syntheticSigma0(roughness:number,incidenceDeg:number){
 const r=Math.min(1,Math.max(0,roughness)),a=Math.min(60,Math.max(15,incidenceDeg));
 return .015+.24*r*Math.cos(rad(a))**2;
}
export const sigmaToDb=(sigma0:number)=>10*Math.log10(sigma0);
export function radarSummary(p:Record<string,number>){
 const mode=Math.round(p.radarType||0),bearing=p.radarBearing??45,wind=p.radarWind??25,direction=p.radarDirection??100;
 const peak=p.radarDbz??52,rough=p.radarRoughness??.5,incidence=p.radarIncidence??35;
 if(mode===0)return {kind:RADAR_KINDS[0],value:syntheticReflectivity(.27,-.12,peak),unit:'dBZ',extra:dbzToLinear(peak),formula:'dBZ=10 log₁₀(Z / (1 mm⁶·m⁻³))',explanation:'El radar terrestre observa ecos de partículas en la atmósfera. Un valor en dBZ no es una medición directa de lluvia acumulada ni una alerta meteorológica. La tormenta aquí está generada matemáticamente.'};
 if(mode===1)return {kind:RADAR_KINDS[1],value:radialVelocity(wind,direction,bearing),unit:'m/s',extra:wind,formula:'vᵣ=v·cos(α_viento−α_haz)',explanation:'Doppler mide la proyección del movimiento sobre la línea de observación. El movimiento perpendicular al haz es invisible para ese radar. El viento uniforme es un ejemplo, no una tormenta medida.'};
 const sig=syntheticSigma0(rough,incidence);
 return {kind:RADAR_KINDS[2],value:sigmaToDb(sig),unit:'dB σ⁰',extra:sig,formula:'σ⁰_dB=10 log₁₀(σ⁰)',explanation:'SAR es un radar de apertura sintética en órbita que mide el retorno de microondas de superficies. La intensidad depende de geometría, rugosidad, humedad, polarización y otros factores. La escena no reproduce datos SAOCOM.'};
}
